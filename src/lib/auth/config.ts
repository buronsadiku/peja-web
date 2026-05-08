import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db/client";
import * as schema from "../db/schema";

const trustedOrigins = (process.env.TRUSTED_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    disableSignUp: process.env.NODE_ENV === "production",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "admin",
        input: false,
      },
    },
  },
  secret: process.env.AUTH_COOKIE_SECRET,
  trustedOrigins,
  advanced: {
    cookiePrefix: "peja",
    cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
