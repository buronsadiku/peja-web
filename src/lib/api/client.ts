import { env } from "@/lib/utils/env";
import type { ApiErrorBody } from "./types";
import { getCsrfToken, invalidateCsrfToken } from "./csrf-token";

export const API_BASE_PATH = "/api/v1";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_INVALID_CODES = new Set([
  "errors:csrf_required",
  "errors:csrf_invalid",
]);

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static isApiError(value: unknown): value is ApiError {
    return value instanceof ApiError;
  }
}

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  skipCsrf?: boolean;
};

export type Paginated<T> = {
  items: T[];
  nextCursor: string | null;
};

export const buildSearch = (query?: ApiFetchOptions["query"]) => {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const ensureLeadingSlash = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

export const parseError = async (res: Response): Promise<ApiError> => {
  const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
  const code = body?.error?.code ?? "HTTP_ERROR";
  const message = body?.error?.message ?? res.statusText ?? "Request failed";
  return new ApiError(res.status, code, message, body?.error?.details);
};

export const buildRequestInit = (
  options: ApiFetchOptions,
  authHeader?: string,
): RequestInit => {
  const { body, query, headers, skipCsrf, ...rest } = options;
  void query;
  void skipCsrf;
  return {
    ...rest,
    cache: rest.cache ?? "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(authHeader && { Authorization: authHeader }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
};

export const readJson = async <T>(res: Response): Promise<T> => {
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
};

const buildClientUrl = (path: string, query?: ApiFetchOptions["query"]) =>
  `${env.API_URL}${API_BASE_PATH}${ensureLeadingSlash(path)}${buildSearch(query)}`;

const withCsrfHeader = async (
  init: RequestInit,
  method: string,
  forceRefresh: boolean,
): Promise<RequestInit> => {
  if (SAFE_METHODS.has(method)) return init;
  if (forceRefresh) invalidateCsrfToken();
  const token = await getCsrfToken();
  const headers = new Headers(init.headers);
  headers.set("X-CSRF-Token", token);
  return { ...init, headers };
};

const fetchWithCsrfRetry = async (
  url: string,
  init: RequestInit,
  method: string,
): Promise<Response> => {
  let res = await fetch(url, await withCsrfHeader(init, method, false));
  if (res.status === 403) {
    const cloned = res.clone();
    const body = (await cloned.json().catch(() => null)) as ApiErrorBody | null;
    const code = body?.error?.code;
    if (code && CSRF_INVALID_CODES.has(code)) {
      res = await fetch(url, await withCsrfHeader(init, method, true));
    }
  }
  return res;
};

export const clientFetch = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> => {
  const method = (options.method ?? "GET").toUpperCase();
  const init = buildRequestInit(options);
  const url = buildClientUrl(path, options.query);
  const res = options.skipCsrf
    ? await fetch(url, init)
    : await fetchWithCsrfRetry(url, init, method);
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{ data: T }>(res);
  return (json?.data ?? (undefined as T)) as T;
};

export const clientFetchPaginated = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Paginated<T>> => {
  const method = (options.method ?? "GET").toUpperCase();
  const init = buildRequestInit(options);
  const url = buildClientUrl(path, options.query);
  const res = options.skipCsrf
    ? await fetch(url, init)
    : await fetchWithCsrfRetry(url, init, method);
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{ data: T[]; nextCursor: string | null }>(res);
  return { items: json?.data ?? [], nextCursor: json?.nextCursor ?? null };
};
