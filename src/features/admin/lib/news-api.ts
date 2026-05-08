"use client";

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
};

export type NewsRow = {
  id: string;
  slug: string;
  title: string;
  body: string;
  imageUrl: string | null;
  pinned: boolean;
  publishedAt: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsInput = {
  slug: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  pinned?: boolean;
  publishedAt?: string;
  expiresAt?: string | null;
};

export type SponsorRow = {
  id: string;
  name: string;
  logoUrl: string;
  url: string | null;
  tier: "gold" | "silver" | "bronze";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type SponsorInput = {
  name: string;
  logoUrl: string;
  url?: string | null;
  tier: "gold" | "silver" | "bronze";
  sortOrder?: number;
};

export const newsAdminApi = {
  list: () =>
    request<{ data: NewsRow[]; pagination: { total: number } }>(
      "/api/admin/news?limit=100",
    ).then((r) => r.data),
  create: (body: NewsInput) =>
    request<{ data: NewsRow }>("/api/admin/news", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((r) => r.data),
  update: (id: string, body: Partial<NewsInput>) =>
    request<{ data: NewsRow }>(`/api/admin/news/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((r) => r.data),
  delete: (id: string) =>
    request<void>(`/api/admin/news/${id}`, { method: "DELETE" }),
};

export const sponsorsAdminApi = {
  list: () =>
    request<{ data: SponsorRow[] }>("/api/admin/sponsors").then((r) => r.data),
  create: (body: SponsorInput) =>
    request<{ data: SponsorRow }>("/api/admin/sponsors", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((r) => r.data),
  update: (id: string, body: Partial<SponsorInput>) =>
    request<{ data: SponsorRow }>(`/api/admin/sponsors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((r) => r.data),
  delete: (id: string) =>
    request<void>(`/api/admin/sponsors/${id}`, { method: "DELETE" }),
};
