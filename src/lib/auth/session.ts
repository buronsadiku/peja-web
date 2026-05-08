import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "./better-auth";
import type { User } from "@/lib/api/types";

export type { User };

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) return null;
  return session.user as unknown as User;
});
