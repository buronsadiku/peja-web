import type { MessageSummary } from "@/lib/api/types";

export type GuestRow = {
  id: string;
  name: string;
  initials: string;
  tint: string;
  messageCount: number;
  audioCount: number;
  photoCount: number;
  videoCount: number;
  favoriteCount: number;
  hasPhoto: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
  isFavorite: boolean;
  lastAt: string;
  firstAt: string;
};

const TINTS = [
  "#EFC9A8",
  "#D8C9B2",
  "#B9C9D9",
  "#C8B5D9",
  "#B8D3B6",
  "#E9BFC4",
  "#F2D7B3",
  "#ADC4D1",
];

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const tintFor = (key: string): string => TINTS[hashString(key) % TINTS.length];

const initialsFor = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const guestKey = (rawName: string): string =>
  rawName.trim().toLocaleLowerCase().replace(/\s+/g, " ") || "__anonymous__";

export const aggregateGuests = (
  messages: MessageSummary[],
  anonymousLabel: string,
): GuestRow[] => {
  const map = new Map<string, GuestRow>();

  for (const m of messages) {
    const displayName = m.guestNames?.trim() || anonymousLabel;
    const id = guestKey(displayName);
    const existing = map.get(id);
    const ts = m.createdAt;

    if (!existing) {
      map.set(id, {
        id,
        name: displayName,
        initials: initialsFor(displayName),
        tint: tintFor(id),
        messageCount: 1,
        audioCount: m.hasAudio ? 1 : 0,
        photoCount: m.hasPhoto ? 1 : 0,
        videoCount: m.hasVideo ? 1 : 0,
        favoriteCount: m.isFavorite ? 1 : 0,
        hasPhoto: m.hasPhoto,
        hasAudio: m.hasAudio,
        hasVideo: m.hasVideo,
        isFavorite: m.isFavorite,
        firstAt: ts,
        lastAt: ts,
      });
      continue;
    }

    existing.messageCount += 1;
    if (m.hasAudio) existing.audioCount += 1;
    if (m.hasPhoto) existing.photoCount += 1;
    if (m.hasVideo) existing.videoCount += 1;
    if (m.isFavorite) existing.favoriteCount += 1;
    existing.hasPhoto = existing.hasPhoto || m.hasPhoto;
    existing.hasAudio = existing.hasAudio || m.hasAudio;
    existing.hasVideo = existing.hasVideo || m.hasVideo;
    existing.isFavorite = existing.isFavorite || m.isFavorite;
    if (ts > existing.lastAt) existing.lastAt = ts;
    if (ts < existing.firstAt) existing.firstAt = ts;
  }

  return Array.from(map.values());
};

export type GuestFilter =
  | "all"
  | "favorites"
  | "with_photo"
  | "with_audio"
  | "with_video";

export const applyGuestFilter = (
  guests: GuestRow[],
  filter: GuestFilter,
): GuestRow[] => {
  switch (filter) {
    case "favorites":
      return guests.filter((g) => g.isFavorite);
    case "with_photo":
      return guests.filter((g) => g.hasPhoto);
    case "with_audio":
      return guests.filter((g) => g.hasAudio);
    case "with_video":
      return guests.filter((g) => g.hasVideo);
    default:
      return guests;
  }
};

export type GuestSort =
  | "recent"
  | "oldest"
  | "name_asc"
  | "name_desc"
  | "most_messages";

export const applyGuestSort = (
  guests: GuestRow[],
  sort: GuestSort,
): GuestRow[] => {
  const arr = [...guests];
  switch (sort) {
    case "oldest":
      return arr.sort((a, b) => a.lastAt.localeCompare(b.lastAt));
    case "name_asc":
      return arr.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );
    case "name_desc":
      return arr.sort((a, b) =>
        b.name.localeCompare(a.name, undefined, { sensitivity: "base" }),
      );
    case "most_messages":
      return arr.sort(
        (a, b) =>
          b.messageCount - a.messageCount || b.lastAt.localeCompare(a.lastAt),
      );
    default:
      return arr.sort((a, b) => b.lastAt.localeCompare(a.lastAt));
  }
};

export const applyGuestSearch = (
  guests: GuestRow[],
  query: string,
): GuestRow[] => {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return guests;
  return guests.filter((g) => g.name.toLocaleLowerCase().includes(q));
};
