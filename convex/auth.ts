import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";
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
                rpID: "localhost",
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

