"use client";

import { create } from "zustand";
import type { MessageFilter } from "@/lib/api/types";

type MessagesState = {
  filter: MessageFilter;
  selectedIds: Set<string>;
  activeMessageId: string | null;
  setFilter: (filter: MessageFilter) => void;
  toggleSelected: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setActiveMessageId: (id: string | null) => void;
  toggleActiveMessageId: (id: string) => void;
  reset: () => void;
};

const initial = {
  filter: "all" as MessageFilter,
  selectedIds: new Set<string>(),
  activeMessageId: null as string | null,
};

export const useMessagesStore = create<MessagesState>((set) => ({
  ...initial,
  setFilter: (filter) =>
    set({ filter, selectedIds: new Set(), activeMessageId: null }),
  toggleSelected: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),
  setActiveMessageId: (id) => set({ activeMessageId: id }),
  toggleActiveMessageId: (id) =>
    set((s) => ({ activeMessageId: s.activeMessageId === id ? null : id })),
  reset: () => set({ ...initial, selectedIds: new Set() }),
}));

export const useFilter = () => useMessagesStore((s) => s.filter);
export const useSelectedIds = () => useMessagesStore((s) => s.selectedIds);
export const useActiveMessageId = () =>
  useMessagesStore((s) => s.activeMessageId);
