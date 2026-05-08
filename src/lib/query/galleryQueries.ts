"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { mediaClient } from "@/lib/api/media-client";
import type { Paginated } from "@/lib/api/client";
import type { GalleryItem } from "@/lib/api/types";
import { queryKeys } from "./keys";

type GalleryFilter = {
  type?: "photo" | "video" | "all";
  filter?: "all" | "favorites" | "gold_book";
  sort?: "newest" | "oldest";
  search?: string;
  limit?: number;
};

export const useInfiniteGallery = (eventId: string, input: GalleryFilter = {}) =>
  useInfiniteQuery({
    queryKey: queryKeys.gallery.infiniteList(eventId, input),
    queryFn: ({ pageParam }) =>
      mediaClient.gallery(eventId, {
        type: input.type,
        filter: input.filter,
        sort: input.sort,
        search: input.search,
        limit: input.limit,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? null,
    enabled: Boolean(eventId),
  });

export const useDeleteMedia = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (mediaId) => mediaClient.remove(eventId, mediaId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.gallery.all(eventId) });
      qc.invalidateQueries({ queryKey: queryKeys.events.stats(eventId) });
    },
  });
};

type UpdateMediaInput = {
  mediaId: string;
  patch: { isFavorite?: boolean; isGoldBookSelected?: boolean };
};

type GallerySnapshot = InfiniteData<Paginated<GalleryItem>, string | null>;

const isGallerySnapshot = (value: unknown): value is GallerySnapshot =>
  typeof value === "object" &&
  value !== null &&
  Array.isArray((value as { pages?: unknown }).pages);

const patchInGalleryPages = (
  snapshot: GallerySnapshot,
  mediaId: string,
  patch: UpdateMediaInput["patch"],
): GallerySnapshot => ({
  ...snapshot,
  pages: snapshot.pages.map((page) => ({
    ...page,
    items: page.items.map((item) =>
      item.id === mediaId ? { ...item, ...patch } : item,
    ),
  })),
});

type RollbackContext = {
  previousSnapshots: [readonly unknown[], GallerySnapshot][];
};

export const useUpdateMedia = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<
    {
      media: { id: string; isFavorite: boolean; isGoldBookSelected: boolean };
    },
    Error,
    UpdateMediaInput,
    RollbackContext
  >({
    mutationFn: ({ mediaId, patch }) =>
      mediaClient.update(eventId, mediaId, patch),
    onMutate: async ({ mediaId, patch }) => {
      await qc.cancelQueries({ queryKey: queryKeys.gallery.all(eventId) });
      const entries = qc.getQueriesData<unknown>({
        queryKey: queryKeys.gallery.all(eventId),
      });
      const previousSnapshots: [readonly unknown[], GallerySnapshot][] = [];
      for (const [key, snapshot] of entries) {
        if (isGallerySnapshot(snapshot)) {
          previousSnapshots.push([key, snapshot]);
          qc.setQueryData<GallerySnapshot>(
            key,
            patchInGalleryPages(snapshot, mediaId, patch),
          );
        }
      }
      return { previousSnapshots };
    },
    onError: (_err, _vars, context) => {
      context?.previousSnapshots.forEach(([key, snapshot]) => {
        qc.setQueryData(key, snapshot);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.gallery.all(eventId) });
    },
  });
};
