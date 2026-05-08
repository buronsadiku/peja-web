import type { MessageDetail, MessageSummary } from "@/lib/api/types";

const TINTS = [
  "#EFC9A8",
  "#D8C9B2",
  "#B9C9D9",
  "#C8B5D9",
  "#F2D7B3",
  "#B8D3B6",
  "#E9BFC4",
  "#ADC4D1",
];

export const initialsFrom = (names: string): string => {
  const trimmed = names.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/[\s&,]+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return letters.join("") || trimmed[0]!.toUpperCase();
};

export const tintFrom = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return TINTS[hash % TINTS.length]!;
};

export const waveFrom = (seed: string, length = 48): number[] => {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  }
  const out: number[] = [];
  for (let i = 0; i < length; i += 1) {
    h = (h * 16807) % 2147483647;
    out.push(0.2 + 0.8 * ((h % 1000) / 1000));
  }
  return out;
};

export const formatTimeShort = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDurationShort = (sec: number | null): string => {
  if (!sec || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export type MessageRowView = {
  id: string;
  name: string;
  relation: string;
  quote: string;
  note: string;
  initials: string;
  tint: string;
  duration: string;
  durationSec: number;
  favorited: boolean;
  inGoldBook: boolean;
  hasAudio: boolean;
  hasPhoto: boolean;
  language?: string;
  listens: number;
  time: string;
  createdAt: string;
  wave: number[];
};

export const toMessageRowView = (
  m: MessageSummary,
  anonymousLabel: string,
): MessageRowView => ({
  id: m.id,
  name: m.guestNames || anonymousLabel,
  relation: "",
  quote: m.transcriptSnippet ?? "",
  note: m.writtenNote?.trim() ?? "",
  initials: initialsFrom(m.guestNames),
  tint: tintFrom(m.id),
  duration: formatDurationShort(m.audioDurationSec),
  durationSec: m.audioDurationSec ?? 0,
  favorited: m.isFavorite,
  inGoldBook: m.isGoldBookSelected,
  hasAudio: m.hasAudio,
  hasPhoto: m.hasPhoto,
  listens: 0,
  time: formatTimeShort(m.createdAt),
  createdAt: m.createdAt,
  wave: waveFrom(m.id),
});

export const toMessageRowViewFromDetail = (
  m: MessageDetail,
  anonymous: string,
): MessageRowView => ({
  id: m.id,
  name: m.guestNames || anonymous,
  relation: "",
  quote: m.transcript ? m.transcript.slice(0, 120) : "",
  note: m.writtenNote?.trim() ?? "",
  initials: initialsFrom(m.guestNames),
  tint: tintFrom(m.id),
  duration: formatDurationShort(m.audioDurationSec),
  durationSec: m.audioDurationSec ?? 0,
  favorited: m.isFavorite,
  inGoldBook: m.isGoldBookSelected,
  hasAudio: Boolean(m.audioUrl),
  hasPhoto: m.media.some((item) => item.type === "photo"),
  listens: 0,
  time: formatTimeShort(m.createdAt),
  createdAt: m.createdAt,
  wave: waveFrom(m.id),
});
