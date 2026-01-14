import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { type Theme, type ModelType, getOriginalPrompt, getThemePrompt } from "@/lib/prompts"

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const image = formData.get("image") as File
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const theme = formData.get("theme") as Theme | null
        const modelType = (formData.get("modelType") as ModelType) || "unknown"
        const useOriginalPrompt = formData.get("useOriginalPrompt") === "true"
        const userId = formData.get("userId") as string | null

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 })
        }

        const apiKey = process.env.GOOGLE_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: "API Key not configured" }, { status: 500 })
        }

        // Initialize the new Google GenAI SDK
        const ai = new GoogleGenAI({ apiKey })

        // Convert File to base64
        const buffer = Buffer.from(await image.arrayBuffer())
        const base64Image = buffer.toString("base64")

        let promptText: string

        if (useOriginalPrompt) {
            // Original prompt for "Let us decide"
            promptText = getOriginalPrompt(name, description)
        } else if (theme) {
            // Use theme-specific prompt
            promptText = getThemePrompt(theme, modelType, name, description)
        } else {
            return NextResponse.json({ error: "Theme selection required" }, { status: 400 })
        }

        const prompt = [
            { text: promptText },
            {
                inlineData: {
                    mimeType: image.type || "image/png",
                    data: base64Image,
                },
            },
        ]

        console.log("Generating content with gemini-2.5-flash-image...")

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [
                {
                    role: "user",
                    parts: prompt
                }
            ],
            config: {
                responseModalities: ["IMAGE"],
                imageConfig: {
                    aspectRatio: "3:4"
                }
            }
        })

        // Extract the image from the response candidates
        if (response.candidates && response.candidates.length > 0 && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const mimeType = part.inlineData.mimeType || "image/png"
                    const b64 = part.inlineData.data
                    
                    if (!b64) continue;

                    const imageBuffer = Buffer.from(b64, 'base64')

                    // --- CONVEX INTEGRATION (via HTTP Actions to bypass ETIMEDOUT) ---
                    try {
                        const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
                        if (convexSiteUrl) {
                            console.log("Saving to Convex via HTTP Action...");
                            
                            // 1. Upload to Convex Storage via direct HTTP Action
                            const uploadResponse = await fetch(`${convexSiteUrl}/upload-file`, {
                                method: "POST",
                                headers: { "Content-Type": mimeType },
                                body: imageBuffer,
                            })
                            
                            if (!uploadResponse.ok) {
                                throw new Error(`Failed to upload to storage: ${uploadResponse.status}`);
                            }
                            
                            const { storageId } = await uploadResponse.json()
                            console.log("Saved to storage:", storageId);
                            
                            // 2. Save record to DB with userId explicitly passed
                            await fetch(`${convexSiteUrl}/save-generation`, {
                                method: "POST",
                                headers: { 
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    name,
                                    description,
                                    theme: theme || "Let us decide",
                                    storageId,
                                    userId, // Pass userId directly
                                }),
                            });
                            console.log("Generation saved to DB");
                        } else {
                            console.warn("NEXT_PUBLIC_CONVEX_SITE_URL not configured, skipping save.");
                        }
                    } catch (dbError) {
                        console.error("Error saving to Convex:", dbError)
                    }
                    // --------------------------

                    return NextResponse.json({
                        success: true,
                        image: `data:${mimeType};base64,${b64}`
                    })
                }
            }
        }

        console.warn("No image found in response:", JSON.stringify(response, null, 2))
        throw new Error("Model generated a response but it contained no image data.")

    } catch (error) {
        console.error("Error generating brochure:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        )
    }
}
