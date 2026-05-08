import "server-only";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { env } from "@/lib/utils/env";

const ACCESS_TOKEN_COOKIE = "auth_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

const baseCookieOptions = (): Partial<ResponseCookie> => ({
  httpOnly: true,
  sameSite: "lax",
  secure: env.IS_PRODUCTION,
  path: "/",
});

export const setAuthCookies = async (input: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}): Promise<void> => {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, input.accessToken, {
    ...baseCookieOptions(),
    maxAge: input.expiresIn,
  });
  store.set(REFRESH_TOKEN_COOKIE, input.refreshToken, {
    ...baseCookieOptions(),
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const clearAuthCookies = async (): Promise<void> => {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
};

export const readAccessToken = async (): Promise<string | null> => {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
};

export const readRefreshToken = async (): Promise<string | null> => {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
};
