import { createZipBlob } from "./createZip";

const sanitize = (s: string): string =>
  s.replace(/[^\p{L}\p{N}\-_ ]+/gu, "").trim() || "guest";

const extFromUrl = (url: string, fallback: string): string => {
  try {
    const path = new URL(url).pathname;
    const m = path.match(/\.([a-zA-Z0-9]{2,5})$/);
    return m ? m[1].toLowerCase() : fallback;
  } catch {
    return fallback;
  }
};

const fetchBlob = async (url: string): Promise<Blob> => {
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) throw new Error(`Fetch ${url} failed (${res.status})`);
  return res.blob();
};

const triggerSave = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export type DownloadInputs = {
  guestName: string;
  audioUrl?: string | null;
  videoUrl?: string | null;
  photoUrl?: string | null;
  writtenNote?: string | null;
};

const tryFetchBlob = async (url: string): Promise<Blob | null> => {
  try {
    return await fetchBlob(url);
  } catch (err) {
    console.warn(`[export] skip missing asset ${url}`, err);
    return null;
  }
};

const buildFilesForMessage = async (
  input: DownloadInputs,
  prefix: string,
): Promise<{ name: string; blob: Blob }[]> => {
  const files: { name: string; blob: Blob }[] = [];
  if (input.audioUrl) {
    const blob = await tryFetchBlob(input.audioUrl);
    if (blob) {
      files.push({
        name: `${prefix}/audio.${extFromUrl(input.audioUrl, "webm")}`,
        blob,
      });
    }
  }
  if (input.videoUrl) {
    const blob = await tryFetchBlob(input.videoUrl);
    if (blob) {
      files.push({
        name: `${prefix}/video.${extFromUrl(input.videoUrl, "mp4")}`,
        blob,
      });
    }
  }
  if (input.photoUrl) {
    const blob = await tryFetchBlob(input.photoUrl);
    if (blob) {
      files.push({
        name: `${prefix}/photo.${extFromUrl(input.photoUrl, "jpg")}`,
        blob,
      });
    }
  }
  if (input.writtenNote && input.writtenNote.trim()) {
    files.push({
      name: `${prefix}/note.txt`,
      blob: new Blob([input.writtenNote], { type: "text/plain" }),
    });
  }
  return files;
};

export const downloadMessageAssets = async (
  input: DownloadInputs,
): Promise<void> => {
  const guest = sanitize(input.guestName);
  const files = await buildFilesForMessage(input, guest);
  if (files.length === 0) return;
  const zipBlob = await createZipBlob(files);
  triggerSave(zipBlob, `${guest}.zip`);
};

export type MediaDownloadInput = {
  guestName: string;
  mediaUrl: string;
  type: "photo" | "video";
  createdAt: string;
};

const formatStamp = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown-time";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
};

export const downloadMediaFlat = async (
  inputs: MediaDownloadInput[],
  zipName: string,
): Promise<void> => {
  const files: { name: string; blob: Blob }[] = [];
  const usedNames = new Map<string, number>();
  const folder = sanitize(zipName);
  for (const input of inputs) {
    const blob = await tryFetchBlob(input.mediaUrl);
    if (!blob) continue;
    const fallback = input.type === "video" ? "mp4" : "jpg";
    const ext = extFromUrl(input.mediaUrl, fallback);
    const base = `${sanitize(input.guestName)}_${formatStamp(input.createdAt)}`;
    const seen = usedNames.get(base) ?? 0;
    usedNames.set(base, seen + 1);
    const fileName =
      seen === 0 ? `${base}.${ext}` : `${base} (${seen + 1}).${ext}`;
    files.push({ name: `${folder}/${fileName}`, blob });
  }
  if (files.length === 0) return;
  const zipBlob = await createZipBlob(files);
  triggerSave(zipBlob, `${zipName}.zip`);
};

export const downloadManyMessages = async (
  inputs: DownloadInputs[],
  zipName: string,
  rootFolder?: string,
): Promise<void> => {
  const all: { name: string; blob: Blob }[] = [];
  const usedNames = new Map<string, number>();
  const root = rootFolder ? `${sanitize(rootFolder)}/` : "";
  for (const input of inputs) {
    const base = sanitize(input.guestName);
    const seen = usedNames.get(base) ?? 0;
    const folder = seen === 0 ? base : `${base} (${seen + 1})`;
    usedNames.set(base, seen + 1);
    const files = await buildFilesForMessage(input, `${root}${folder}`);
    all.push(...files);
  }
  if (all.length === 0) return;
  const zipBlob = await createZipBlob(all);
  triggerSave(zipBlob, `${zipName}.zip`);
};
