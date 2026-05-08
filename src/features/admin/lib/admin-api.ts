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

export const adminApi = {
  templates: {
    list: () =>
      request<{ data: ActivityTemplateRow[] }>(
        "/api/admin/activities",
      ).then((r) => r.data),
    create: (body: TemplateInput) =>
      request<{ data: ActivityTemplateRow }>("/api/admin/activities", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    update: (id: string, body: Partial<TemplateInput>) =>
      request<{ data: ActivityTemplateRow }>(`/api/admin/activities/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    delete: (id: string) =>
      request<void>(`/api/admin/activities/${id}`, { method: "DELETE" }),
  },
  occurrences: {
    create: (body: OccurrenceInput) =>
      request<{ data: OccurrenceRow }>("/api/admin/occurrences", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    update: (id: string, body: Partial<OccurrenceInput>) =>
      request<{ data: OccurrenceRow }>(`/api/admin/occurrences/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    delete: (id: string) =>
      request<void>(`/api/admin/occurrences/${id}`, { method: "DELETE" }),
  },
  gallery: {
    list: () =>
      request<{ data: GalleryRow[] }>("/api/admin/gallery").then((r) => r.data),
    create: (body: GalleryInput) =>
      request<{ data: GalleryRow }>("/api/admin/gallery", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    update: (id: string, body: Partial<GalleryInput>) =>
      request<{ data: GalleryRow }>(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    delete: (id: string) =>
      request<void>(`/api/admin/gallery/${id}`, { method: "DELETE" }),
  },
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/gallery/upload", {
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
  registrations: {
    list: () =>
      request<{ data: RegistrationRow[] }>("/api/admin/registrations").then(
        (r) => r.data,
      ),
    update: (id: string, body: Partial<RegistrationInput>) =>
      request<{ data: RegistrationRow }>(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    delete: (id: string) =>
      request<void>(`/api/admin/registrations/${id}`, { method: "DELETE" }),
  },
};

export type TemplateCategory =
  | "workshop"
  | "adventure"
  | "music"
  | "food"
  | "wellness"
  | "cultural";

export type ActivityTemplateRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: TemplateCategory;
  createdAt: string;
  updatedAt: string;
};

export type TemplateInput = {
  name: string;
  slug: string;
  description?: string | null;
  category: TemplateCategory;
};

export type OccurrenceRow = {
  id: string;
  templateId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  location: string | null;
  meetingPoint: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OccurrenceInput = {
  templateId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  location?: string | null;
  meetingPoint?: string | null;
};

export type GallerySection = "live" | "workshops" | "adventures" | "food";

export type GalleryRow = {
  id: string;
  url: string;
  alt: string;
  title: string | null;
  caption: string | null;
  section: GallerySection;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type GalleryInput = {
  url: string;
  alt: string;
  title?: string | null;
  caption?: string | null;
  section: GallerySection;
  sortOrder?: number;
};

export type RegistrationRow = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  date: string;
  responsibilityAccepted: boolean;
  notifyIfAbsent: boolean;
  createdAt: string;
  activities: Array<{
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  }>;
};

export type RegistrationInput = {
  fullName: string;
  phone: string;
  email: string;
  notifyIfAbsent: boolean;
};
