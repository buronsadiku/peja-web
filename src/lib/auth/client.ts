"use client";

import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/utils/env";

export const authClient = createAuthClient({
  baseURL: env.APP_URL,
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
