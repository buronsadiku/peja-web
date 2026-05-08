import { env } from "@/lib/utils/env";
import { API_BASE_PATH } from "./client";

let cached: string | null = null;
let pending: Promise<string> | null = null;

const fetchToken = async (): Promise<string> => {
  const res = await fetch(`${env.API_URL}${API_BASE_PATH}/auth/csrf`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`csrf endpoint returned ${res.status}`);
  const json = (await res.json()) as { data?: { csrfToken?: string } };
  const token = json.data?.csrfToken;
  if (!token) throw new Error("csrf endpoint returned no token");
  return token;
};

/**
 * Returns the current session's CSRF token, fetching once and reusing
 * for the lifetime of the page (the token is rotated server-side on
 * sign-out/sign-in). On 403 with code `errors:csrf_invalid` the caller
 * should call `invalidateCsrfToken()` and retry once.
 */
export const getCsrfToken = async (): Promise<string> => {
  if (cached) return cached;
  if (pending) return pending;
  pending = fetchToken()
    .then((t) => {
      cached = t;
      return t;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
};

export const invalidateCsrfToken = (): void => {
  cached = null;
};
