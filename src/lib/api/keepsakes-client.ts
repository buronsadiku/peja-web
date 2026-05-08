import { clientFetch } from "./client";
import type { KeepsakeCatalog } from "./types";

export type GoldBookPreviewInput = {
  messageIds: string[];
  layout?: "classic" | "modern" | "minimal";
  coverTitle: string;
  coverSubtitle?: string;
};

export type VideoMontagePreviewInput = {
  messageIds: string[];
  style?: "cinematic" | "party" | "emotional";
  musicTrackId?: string;
};

export const keepsakesClient = {
  catalog: () => clientFetch<KeepsakeCatalog>("/keepsakes/catalog"),

  goldBookPreview: (eventId: string, input: GoldBookPreviewInput) =>
    clientFetch<{ jobId: string }>(
      `/events/${eventId}/keepsakes/gold-book/preview`,
      { method: "POST", body: input },
    ),

  videoMontagePreview: (eventId: string, input: VideoMontagePreviewInput) =>
    clientFetch<{ jobId: string }>(
      `/events/${eventId}/keepsakes/video-montage/preview`,
      { method: "POST", body: input },
    ),
};
