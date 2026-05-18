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
  activityCategories: {
    list: () =>
      request<{ data: ActivityCategoryRow[] }>(
        "/api/admin/activity-categories",
      ).then((r) => r.data),
    create: (body: ActivityCategoryInput) =>
      request<{ data: ActivityCategoryRow }>(
        "/api/admin/activity-categories",
        { method: "POST", body: JSON.stringify(body) },
      ).then((r) => r.data),
    update: (id: string, body: Partial<ActivityCategoryInput>) =>
      request<{ data: ActivityCategoryRow }>(
        `/api/admin/activity-categories/${id}`,
        { method: "PATCH", body: JSON.stringify(body) },
      ).then((r) => r.data),
    delete: (id: string) =>
      request<void>(`/api/admin/activity-categories/${id}`, {
        method: "DELETE",
      }),
  },
  activityImages: {
    list: (templateId: string) =>
      request<{ data: ActivityImageRow[] }>(
        `/api/admin/activity-images?templateId=${templateId}`,
      ).then((r) => r.data),
    create: (body: ActivityImageInput) =>
      request<{ data: ActivityImageRow }>("/api/admin/activity-images", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    update: (id: string, body: Partial<ActivityImagePatch>) =>
      request<{ data: ActivityImageRow }>(
        `/api/admin/activity-images/${id}`,
        { method: "PATCH", body: JSON.stringify(body) },
      ).then((r) => r.data),
    delete: (id: string) =>
      request<void>(`/api/admin/activity-images/${id}`, { method: "DELETE" }),
    upload: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/activity-images/upload", {
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
    list: (params?: {
      page?: number;
      limit?: number;
      section?: GallerySection;
      showOnLanding?: boolean;
    }) => {
      const search = new URLSearchParams();
      if (params?.page) search.set("page", String(params.page));
      if (params?.limit) search.set("limit", String(params.limit));
      if (params?.section) search.set("section", params.section);
      if (typeof params?.showOnLanding === "boolean")
        search.set("showOnLanding", String(params.showOnLanding));
      const qs = search.toString();
      return request<PaginatedResponse<GalleryRow>>(
        `/api/admin/gallery${qs ? `?${qs}` : ""}`,
      );
    },
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
  festivalDays: {
    list: () =>
      request<{ data: FestivalDayRow[] }>("/api/admin/festival-days").then(
        (r) => r.data,
      ),
    create: (body: FestivalDayInput) =>
      request<{ data: FestivalDayRow }>("/api/admin/festival-days", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    update: (id: string, body: Partial<FestivalDayInput>) =>
      request<{ data: FestivalDayRow }>(`/api/admin/festival-days/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    delete: (id: string) =>
      request<void>(`/api/admin/festival-days/${id}`, { method: "DELETE" }),
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
    list: (params?: {
      page?: number;
      limit?: number;
      q?: string;
      occurrenceId?: string;
      festivalDayId?: string;
    }) => {
      const search = new URLSearchParams();
      if (params?.page) search.set("page", String(params.page));
      if (params?.limit) search.set("limit", String(params.limit));
      if (params?.q) search.set("q", params.q);
      if (params?.occurrenceId)
        search.set("occurrenceId", params.occurrenceId);
      if (params?.festivalDayId)
        search.set("festivalDayId", params.festivalDayId);
      const qs = search.toString();
      return request<PaginatedResponse<RegistrationRow>>(
        `/api/admin/registrations${qs ? `?${qs}` : ""}`,
      );
    },
    update: (id: string, body: Partial<RegistrationInput>) =>
      request<{ data: RegistrationRow }>(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }).then((r) => r.data),
    delete: (id: string) =>
      request<void>(`/api/admin/registrations/${id}`, { method: "DELETE" }),
  },
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TemplateCategory = string;

export type ActivityTemplateRow = {
  id: string;
  nameEn: string;
  nameSq: string | null;
  slug: string;
  descriptionEn: string | null;
  descriptionSq: string | null;
  contactPhone1: string | null;
  contactPhone2: string | null;
  category: TemplateCategory;
  createdAt: string;
  updatedAt: string;
};

export type TemplateInput = {
  nameEn: string;
  nameSq?: string | null;
  slug: string;
  descriptionEn?: string | null;
  descriptionSq?: string | null;
  contactPhone1?: string | null;
  contactPhone2?: string | null;
  category: TemplateCategory;
};

export type ActivityCategoryRow = {
  id: string;
  value: string;
  labelEn: string;
  labelSq: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ActivityCategoryInput = {
  value: string;
  labelEn: string;
  labelSq?: string | null;
  sortOrder?: number;
};

export type ActivityImageRow = {
  id: string;
  templateId: string;
  url: string;
  alt: string;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
};

export type ActivityImageInput = {
  templateId: string;
  url: string;
  alt?: string;
  sortOrder?: number;
  isCover?: boolean;
};

export type ActivityImagePatch = {
  alt: string;
  sortOrder: number;
  isCover: boolean;
};

export type OccurrenceRow = {
  id: string;
  templateId: string;
  festivalDayId: string;
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
  festivalDayId: string;
  startTime: string;
  endTime: string;
  capacity: number;
  location?: string | null;
  meetingPoint?: string | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
};

export type FestivalDayRow = {
  id: string;
  date: string;
  label: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type FestivalDayInput = {
  date: string;
  label?: string | null;
  sortOrder?: number;
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
  showOnLanding: boolean;
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
  showOnLanding?: boolean;
};

export type RegistrationRow = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  festivalDayId: string;
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
