import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { image, name, description, theme, userId } = await req.json();
        
        // Use the .site URL for everything now
        const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL!;
        
        console.log("Debug Save: Starting via HTTP Action with userId:", userId);
        
        // 1. Upload directly via HTTP Action on .site domain
        const base64Data = image.split(",")[1];
        const mimeType = image.split(";")[0].split(":")[1];
        const buffer = Buffer.from(base64Data, "base64");

        console.log("Step 1: Uploading directly to .site/upload-file...");
        const uploadResponse = await fetch(`${convexSiteUrl}/upload-file`, {
            method: "POST",
            headers: { "Content-Type": mimeType },
            body: buffer,
        });
        
        if (!uploadResponse.ok) throw new Error("Failed to upload via HTTP Action");
        
        const { storageId } = await uploadResponse.json();
        console.log("Step 1 Success: Uploaded to storage:", storageId);
        
        // 2. Save Record via HTTP POST with userId explicitly passed
        console.log("Step 2: Saving generation record with userId:", userId);
        const saveRes = await fetch(`${convexSiteUrl}/save-generation`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                theme: theme || "Debug",
                storageId,
                userId, // Pass userId directly
            }),
        });

        if (!saveRes.ok) throw new Error("Failed to save generation record");

        return NextResponse.json({ success: true, storageId });
    } catch (error) {
        console.error("Debug Save Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

