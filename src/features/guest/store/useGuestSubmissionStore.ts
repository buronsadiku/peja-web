"use client";

import { create } from "zustand";

export type AudioCapture = {
  blob: Blob;
  url: string;
  durationSec: number;
  mimeType: string;
};

export type VideoCapture = {
  blob: Blob;
  url: string;
  durationSec: number;
  mimeType: string;
};

export type PhotoCapture = {
  file: File;
  url: string;
  width: number;
  height: number;
};

type GuestSubmissionState = {
  slug: string | null;
  sessionStartAt: number | null;
  guestName: string;
  audio: AudioCapture | null;
  video: VideoCapture | null;
  note: string;
  photo: PhotoCapture | null;
  setSlug: (slug: string) => void;
  setGuestName: (name: string) => void;
  setAudio: (audio: AudioCapture | null) => void;
  setVideo: (video: VideoCapture | null) => void;
  setNote: (note: string) => void;
  setPhoto: (photo: PhotoCapture | null) => void;
  hasAnyContent: () => boolean;
  reset: () => void;
};

const initial = {
  slug: null,
  sessionStartAt: null,
  guestName: "",
  audio: null,
  video: null,
  note: "",
  photo: null,
} as const;

const revoke = (url: string | undefined) => {
  if (url) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }
};

export const useGuestSubmissionStore = create<GuestSubmissionState>(
  (set, get) => ({
    ...initial,
    setSlug: (slug) => {
      const current = get().slug;
      if (current && current !== slug) {
        revoke(get().audio?.url);
        revoke(get().video?.url);
        revoke(get().photo?.url);
        set({ ...initial, slug, sessionStartAt: Date.now() });
      } else {
        set({
          slug,
          sessionStartAt: get().sessionStartAt ?? Date.now(),
        });
      }
    },
    setGuestName: (guestName) => set({ guestName }),
    setAudio: (audio) => {
      revoke(get().audio?.url);
      set({ audio });
    },
    setVideo: (video) => {
      revoke(get().video?.url);
      set({ video });
    },
    setNote: (note) => set({ note }),
    setPhoto: (photo) => {
      revoke(get().photo?.url);
      set({ photo });
    },
    hasAnyContent: () => {
      const { audio, video, note, photo } = get();
      return Boolean(audio || video || photo) || note.trim().length > 0;
    },
    reset: () => {
      revoke(get().audio?.url);
      revoke(get().video?.url);
      revoke(get().photo?.url);
      set({ ...initial });
    },
  }),
);
