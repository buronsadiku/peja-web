import type {
  ActivityListItem,
  ApiError,
  CreateRegistrationBody,
  CreateRegistrationResponse,
  FestivalDay,
  GalleryListResponse,
  GallerySection,
  RegistrationLookup,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public payload: ApiError | { message: string },
  ) {
    super(
      "message" in payload ? payload.message : `request failed (${status})`,
    );
  }
}

const request = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");

  if (!res.ok) {
    const payload = isJson ? await res.json() : { message: res.statusText };
    throw new ApiClientError(res.status, payload);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
};

export const api = {
  activities: {
    list: (festivalDayId?: string) =>
      request<{ data: ActivityListItem[] }>(
        festivalDayId
          ? `/v1/activities?festivalDayId=${festivalDayId}`
          : "/v1/activities",
      ).then((r) => r.data),
    festivalDays: () =>
      request<{ data: FestivalDay[] }>("/v1/activities/festival-days").then(
        (r) => r.data,
      ),
  },
  gallery: {
    list: (params: {
      section?: GallerySection;
      page?: number;
      limit?: number;
    } = {}) => {
      const search = new URLSearchParams();
      if (params.section) search.set("section", params.section);
      if (params.page) search.set("page", String(params.page));
      if (params.limit) search.set("limit", String(params.limit));
      const qs = search.toString();
      return request<GalleryListResponse>(
        `/v1/gallery${qs ? `?${qs}` : ""}`,
      );
    },
  },
  registrations: {
    create: (body: CreateRegistrationBody) =>
      request<{ data: CreateRegistrationResponse }>("/v1/registrations", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    lookup: (email: string) =>
      request<{ data: RegistrationLookup }>(
        `/v1/registrations/lookup?email=${encodeURIComponent(email)}`,
      ).then((r) => r.data),
  },
};
