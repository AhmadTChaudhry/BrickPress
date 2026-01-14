import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// Register debug/API routes on the .site domain
http.route({
  path: "/get-upload-url",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = await ctx.storage.generateUploadUrl();
    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

// New direct upload route to bypass .cloud timeouts
http.route({
  path: "/upload-file",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);
    return new Response(JSON.stringify({ storageId }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

http.route({
  path: "/save-generation",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { name, description, theme, storageId, userId } = await request.json();
    
    // userId is passed directly from Next.js API route where auth works reliably
    console.log("HTTP Action: Saving generation with userId:", userId || "anonymous");

    await ctx.runMutation(api.generations.saveGeneration, {
      name,
      description,
      theme,
      storageId,
      userId: userId || undefined,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

export default http;
