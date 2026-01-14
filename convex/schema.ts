import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  generations: defineTable({
    name: v.string(),
    description: v.string(),
    theme: v.string(),
    storageId: v.id("_storage"),
    userId: v.optional(v.union(v.id("user"), v.string())), // Support both for now
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"])
    .index("by_userId", ["userId"]), // Added index for filtering by user
  
  // Passkey table required by Better Auth Passkey plugin
  passkey: defineTable({
    name: v.optional(v.string()),
    publicKey: v.string(),
    userId: v.string(),
    credentialID: v.string(),
    counter: v.number(),
    deviceType: v.string(),
    backedUp: v.boolean(),
    transports: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    aaguid: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
});
