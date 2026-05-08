"use client";

import { create } from "zustand";

export type PhotoSubFilter = "all" | "favorites" | "gold_book";
export type PhotoSort = "newest" | "oldest";

type PhotosState = {
  subFilter: PhotoSubFilter;
  sort: PhotoSort;
  search: string;
  selectedIds: Set<string>;
  lightboxIndex: number | null;
  setSubFilter: (next: PhotoSubFilter) => void;
  setSort: (next: PhotoSort) => void;
  setSearch: (next: string) => void;
  toggleSelected: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  setLightboxIndex: (index: number) => void;
};

const initial = {
  subFilter: "all" as PhotoSubFilter,
  sort: "newest" as PhotoSort,
  search: "",
  selectedIds: new Set<string>(),
  lightboxIndex: null as number | null,
};

export const usePhotosStore = create<PhotosState>((set) => ({
  ...initial,
  setSubFilter: (next) =>
    set({
      subFilter: next,
      selectedIds: new Set(),
      lightboxIndex: null,
    }),
  setSort: (next) =>
    set({
      sort: next,
      selectedIds: new Set(),
      lightboxIndex: null,
    }),
  setSearch: (next) =>
    set({
      search: next,
      selectedIds: new Set(),
      lightboxIndex: null,
    }),
  toggleSelected: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),
  openLightbox: (index) => set({ lightboxIndex: index }),
  closeLightbox: () => set({ lightboxIndex: null }),
  setLightboxIndex: (index) => set({ lightboxIndex: index }),
}));

export const useSubFilter = () => usePhotosStore((s) => s.subFilter);
export const usePhotoSort = () => usePhotosStore((s) => s.sort);
export const usePhotoSearch = () => usePhotosStore((s) => s.search);
export const usePhotoSelectedIds = () =>
  usePhotosStore((s) => s.selectedIds);
export const useLightboxIndex = () => usePhotosStore((s) => s.lightboxIndex);
