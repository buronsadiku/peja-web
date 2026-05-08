"use client";

import { create } from "zustand";
import type { GuestFilter, GuestSort } from "../adapters";

type GuestsState = {
  filter: GuestFilter;
  sort: GuestSort;
  search: string;
  page: number;
  selectedIds: Set<string>;
  setFilter: (filter: GuestFilter) => void;
  setSort: (sort: GuestSort) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  toggleSelected: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
};

export const useGuestsStore = create<GuestsState>((set) => ({
  filter: "all",
  sort: "recent",
  search: "",
  page: 1,
  selectedIds: new Set<string>(),
  setFilter: (filter) => set({ filter, page: 1, selectedIds: new Set() }),
  setSort: (sort) => set({ sort, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  toggleSelected: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),
}));

export const useGuestFilter = () => useGuestsStore((s) => s.filter);
export const useGuestSort = () => useGuestsStore((s) => s.sort);
export const useGuestSearch = () => useGuestsStore((s) => s.search);
export const useGuestPage = () => useGuestsStore((s) => s.page);
export const useGuestSelectedIds = () =>
  useGuestsStore((s) => s.selectedIds);
