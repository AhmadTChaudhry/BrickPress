import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveGeneration = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    theme: v.string(),
    storageId: v.id("_storage"),
    userId: v.optional(v.string()), 
  },
  handler: async (ctx, args) => {
    let userId = args.userId;
    
    if (!userId) {
      try {
        const user = await authComponent.getAuthUser(ctx);
        if (user) {
          userId = user._id;
        }
      } catch (e) {
        // Silently ignore auth errors during save
      }
    }

    // Normalize userId to string for consistent querying
    // (Convex Id types serialize to strings anyway)
    const normalizedUserId = userId ? String(userId) : undefined;

    console.log("Saving generation with userId:", normalizedUserId);

    return await ctx.db.insert("generations", {
      name: args.name,
      description: args.description,
      theme: args.theme,
      storageId: args.storageId,
      userId: normalizedUserId as any, // Cast to allow both string and Id
      createdAt: Date.now(),
    });
  },
});

export const getRecentGenerations = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let user;
    try {
      user = await authComponent.getAuthUser(ctx);
    } catch (e) {
      // If unauthenticated, just return empty list instead of crashing
      return [];
    }
    
    if (!user) return [];

    const limit = args.limit ?? 20;
    
    // Normalize userId to string for consistent querying
    const userIdString = String(user._id);
    
    console.log("Querying generations for userId:", userIdString);
    
    const generations = await ctx.db
      .query("generations")
      .withIndex("by_userId", (q) => q.eq("userId", userIdString))
      .order("desc")
      .take(limit);

    console.log("Found generations:", generations.length);

    return await Promise.all(
      generations.map(async (gen) => ({
        ...gen,
        imageUrl: await ctx.storage.getUrl(gen.storageId),
      }))
    );
  },
});
