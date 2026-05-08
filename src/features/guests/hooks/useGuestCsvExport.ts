"use client";

import { useMutation } from "@tanstack/react-query";
import type { GuestRow } from "../adapters";

const escapeCsv = (value: string): string => {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
};

const buildCsv = (guests: GuestRow[]): string => {
  const header = [
    "Guest",
    "Messages",
    "Audio",
    "Photos",
    "Videos",
    "Favourited",
    "First contribution",
    "Last contribution",
  ];
  const rows = guests.map((g) => [
    g.name,
    String(g.messageCount),
    String(g.audioCount),
    String(g.photoCount),
    String(g.videoCount),
    g.isFavorite ? "yes" : "no",
    g.firstAt,
    g.lastAt,
  ]);
  return [header, ...rows]
    .map((cols) => cols.map(escapeCsv).join(","))
    .join("\n");
};

const triggerDownload = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const formatDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const useGuestCsvExport = () => {
  const mutation = useMutation({
    mutationFn: async (guests: GuestRow[]) => {
      if (guests.length === 0) return;
      const csv = buildCsv(guests);
      triggerDownload(csv, `guests ${formatDate(new Date())}.csv`);
    },
  });

  return {
    exportCsv: (guests: GuestRow[]) => mutation.mutate(guests),
    isExporting: mutation.isPending,
  };
};
