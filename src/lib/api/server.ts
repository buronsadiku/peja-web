import "server-only";
import { headers as nextHeaders } from "next/headers";
import { getLocale } from "next-intl/server";
import { env } from "@/lib/utils/env";
import {
  API_BASE_PATH,
  buildRequestInit,
  buildSearch,
  ensureLeadingSlash,
  parseError,
  readJson,
  type ApiFetchOptions,
  type Paginated,
} from "./client";

const buildBackendUrl = (path: string, query?: ApiFetchOptions["query"]) =>
  `${env.API_URL_INTERNAL || env.API_URL}${API_BASE_PATH}${ensureLeadingSlash(path)}${buildSearch(query)}`;

const withSessionHeaders = async (init: RequestInit): Promise<RequestInit> => {
  const headers = new Headers(init.headers);
  const incoming = await nextHeaders();
  const cookieHeader = incoming.get("cookie");
  if (cookieHeader) headers.set("cookie", cookieHeader);
  if (!headers.has("accept-language")) {
    headers.set("accept-language", await getLocale());
  }
  return { ...init, headers };
};

export const apiFetch = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> => {
  const init = await withSessionHeaders(buildRequestInit(options));
  const res = await fetch(buildBackendUrl(path, options.query), init);
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{ data: T }>(res);
  return (json?.data ?? (undefined as T)) as T;
};

export const apiFetchPaginated = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Paginated<T>> => {
  const init = await withSessionHeaders(buildRequestInit(options));
  const res = await fetch(buildBackendUrl(path, options.query), init);
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{ data: T[]; nextCursor: string | null }>(res);
  return { items: json?.data ?? [], nextCursor: json?.nextCursor ?? null };
};
