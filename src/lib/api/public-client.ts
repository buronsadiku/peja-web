import { clientFetch } from "./client";
import type {
  CreateMessageResult,
  GalleryFeed,
  PublicEvent,
  UploadUrlsResult,
} from "./types";

export type UploadMediaItem = {
  type: "photo" | "video";
  contentType: string;
};

export type UploadUrlRequest = {
  audioContentType?: string | null;
  media?: UploadMediaItem[];
  source?: SubmissionSource;
};

export type SubmissionSource = "kiosk" | "qr_scan" | "direct_link";

export type CreateMessageInput = {
  guestNames: string;
  audioKey?: string | null;
  audioDurationSec?: number | null;
  audioMimeType?: string | null;
  mediaIds?: string[];
  writtenNote?: string | null;
  submissionSource: SubmissionSource;
  submissionLanguage?: string | null;
  clientCreatedAt?: string | null;
  _honeypot?: string;
  _t?: number;
};

export type GalleryQuery = {
  type?: "photo" | "video" | "all";
  cursor?: string;
  limit?: number;
};

export const publicClient = {
  getEvent: (slug: string) =>
    clientFetch<PublicEvent>(`/public/events/${slug}`, { skipCsrf: true }),

  uploadUrls: (slug: string, request: UploadUrlRequest) =>
    clientFetch<UploadUrlsResult>(`/public/events/${slug}/upload-url`, {
      method: "POST",
      body: request,
      skipCsrf: true,
    }),

  createMessage: (
    slug: string,
    idempotencyKey: string,
    input: CreateMessageInput,
  ) =>
    clientFetch<CreateMessageResult>(`/public/events/${slug}/messages`, {
      method: "POST",
      body: input,
      headers: { "Idempotency-Key": idempotencyKey },
      skipCsrf: true,
    }),

  getGallery: (slug: string, query: GalleryQuery = {}) => {
    const params = new URLSearchParams();
    if (query.type) params.set("type", query.type);
    if (query.cursor) params.set("cursor", query.cursor);
    if (query.limit !== undefined) params.set("limit", String(query.limit));
    const qs = params.toString();
    return clientFetch<GalleryFeed>(
      `/public/events/${slug}/gallery${qs ? `?${qs}` : ""}`,
      { skipCsrf: true },
    );
  },

  recordInvitationOpen: (slug: string, channel: string | null) =>
    clientFetch<void>(`/public/events/${slug}/invitations/open`, {
      method: "POST",
      body: { channel },
      skipCsrf: true,
    }),
};
