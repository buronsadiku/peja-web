import { clientFetch, clientFetchPaginated, type Paginated } from "./client";
import type { GalleryItem, MediaUploadTarget } from "./types";

const mediaPath = (eventId: string) => `/events/${eventId}/media`;

export type MediaUploadItem = {
  type: "photo" | "video";
  contentType: string;
};

export type MediaFinalizeItem = {
  mediaId: string;
  width?: number | null;
  height?: number | null;
  durationSec?: number | null;
  sizeBytes?: number | null;
};

export type GalleryQuery = {
  type?: "photo" | "video" | "all";
  filter?: "all" | "favorites" | "gold_book";
  sort?: "newest" | "oldest";
  search?: string;
  cursor?: string;
  limit?: number;
};

export const mediaClient = {
  uploadUrls: (
    eventId: string,
    items: MediaUploadItem[],
  ): Promise<{ uploadTargets: MediaUploadTarget[] }> =>
    clientFetch<{ uploadTargets: MediaUploadTarget[] }>(
      `${mediaPath(eventId)}/upload-urls`,
      { method: "POST", body: { items } },
    ),

  finalize: (
    eventId: string,
    items: MediaFinalizeItem[],
  ): Promise<{ finalized: number }> =>
    clientFetch<{ finalized: number }>(`${mediaPath(eventId)}/finalize`, {
      method: "POST",
      body: { items },
    }),

  gallery: (
    eventId: string,
    query: GalleryQuery = {},
  ): Promise<Paginated<GalleryItem>> => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (query.type) queryParams.type = query.type;
    if (query.filter) queryParams.filter = query.filter;
    if (query.sort) queryParams.sort = query.sort;
    if (query.search) queryParams.search = query.search;
    if (query.cursor) queryParams.cursor = query.cursor;
    if (query.limit !== undefined) queryParams.limit = query.limit;
    return clientFetchPaginated<GalleryItem>(mediaPath(eventId), {
      query: queryParams,
    });
  },

  remove: (eventId: string, mediaId: string): Promise<void> =>
    clientFetch<void>(`${mediaPath(eventId)}/${mediaId}`, { method: "DELETE" }),

  update: (
    eventId: string,
    mediaId: string,
    input: { isFavorite?: boolean; isGoldBookSelected?: boolean },
  ): Promise<{
    media: { id: string; isFavorite: boolean; isGoldBookSelected: boolean };
  }> =>
    clientFetch<{
      media: { id: string; isFavorite: boolean; isGoldBookSelected: boolean };
    }>(`${mediaPath(eventId)}/${mediaId}`, {
      method: "PATCH",
      body: input,
    }),
};
