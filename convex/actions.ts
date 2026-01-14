import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

export const getUploadUrl = httpAction(async (ctx, request) => {
  const url = await ctx.storage.generateUploadUrl();
  return new Response(JSON.stringify({ url }), {
    status: 200,
    headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
  });
});

export const saveFromApi = httpAction(async (ctx, request) => {
  const { name, description, theme, storageId, userId } = await request.json();
  
  await ctx.runMutation(api.generations.saveGeneration, {
    name,
    description,
    theme,
    storageId,
    userId,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
  });
});
