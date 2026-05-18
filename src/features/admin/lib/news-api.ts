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
  titleEn: string;
  titleSq: string | null;
  bodyEn: string;
  bodySq: string | null;
  imageUrl: string | null;
  pinned: boolean;
  publishedAt: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsInput = {
  slug: string;
  titleEn: string;
  titleSq?: string | null;
  bodyEn: string;
  bodySq?: string | null;
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

export type CommunityRow = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  descriptionEn: string;
  descriptionSq: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CommunityInput = {
  name: string;
  slug: string;
  logoUrl: string;
  descriptionEn: string;
  descriptionSq?: string | null;
  sortOrder?: number;
};

export const communitiesAdminApi = {
  list: () =>
    request<{ data: CommunityRow[] }>("/api/admin/communities").then(
      (r) => r.data,
    ),
  create: (body: CommunityInput) =>
    request<{ data: CommunityRow }>("/api/admin/communities", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((r) => r.data),
  update: (id: string, body: Partial<CommunityInput>) =>
    request<{ data: CommunityRow }>(`/api/admin/communities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((r) => r.data),
  delete: (id: string) =>
    request<void>(`/api/admin/communities/${id}`, { method: "DELETE" }),
  uploadLogo: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/communities/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `upload failed (${res.status})`);
    }
    const json = (await res.json()) as { data: { publicUrl: string } };
    return json.data.publicUrl;
  },
};

export type MusicianRow = {
  id: string;
  festivalDayId: string;
  festivalDayDate: string;
  festivalDayLabel: string | null;
  nameEn: string;
  nameSq: string | null;
  descriptionEn: string | null;
  descriptionSq: string | null;
  photoUrl: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MusicianInput = {
  festivalDayId: string;
  nameEn: string;
  nameSq?: string | null;
  descriptionEn?: string | null;
  descriptionSq?: string | null;
  photoUrl: string;
  sortOrder?: number;
  isPublished?: boolean;
};

export const musiciansAdminApi = {
  list: () =>
    request<{ data: MusicianRow[] }>("/api/admin/musicians").then(
      (r) => r.data,
    ),
  create: (body: MusicianInput) =>
    request<{ data: MusicianRow }>("/api/admin/musicians", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((r) => r.data),
  update: (id: string, body: Partial<MusicianInput>) =>
    request<{ data: MusicianRow }>(`/api/admin/musicians/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((r) => r.data),
  delete: (id: string) =>
    request<void>(`/api/admin/musicians/${id}`, { method: "DELETE" }),
  uploadPhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/musicians/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `upload failed (${res.status})`);
    }
    const json = (await res.json()) as { data: { publicUrl: string } };
    return json.data.publicUrl;
  },
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
