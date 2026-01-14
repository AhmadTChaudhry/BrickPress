import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import authConfig from "./auth.config";

// Public site URL where the Next.js app is hosted.
// In production, set SITE_URL to your Vercel URL, e.g. https://brick-press.vercel.app
const siteUrl = process.env.SITE_URL || "http://localhost:3000";

// Derive rpID (WebAuthn relying party ID) from the site URL hostname
const rpURL = new URL(siteUrl);
const rpID = rpURL.hostname;

// The baseURL must be the public URL where the auth API is proxied (Next.js)
const baseURL = `${siteUrl}/api/auth`;

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
    return betterAuth({
        baseURL: baseURL,
        database: authComponent.adapter(ctx),
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
        },
        plugins: [
            convex({ authConfig }),
            passkey({
                rpID,
                rpName: "BrickPress",
                origin: siteUrl,
            }),
        ],
    });
};

// Example function for getting the current user
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        try {
            return await authComponent.getAuthUser(ctx);
        } catch (e) {
            return null;
        }
    },
});

