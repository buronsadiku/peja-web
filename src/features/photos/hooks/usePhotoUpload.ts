"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import {
  mediaClient,
  type MediaFinalizeItem,
  type MediaUploadItem,
} from "@/lib/api/media-client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import { queryKeys } from "@/lib/query/keys";

const readImageDimensions = (file: File) =>
  new Promise<{ width: number; height: number } | null>((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });

const readVideoMetadata = (file: File) =>
  new Promise<{ durationSec: number | null }>((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const dur = Number.isFinite(video.duration) ? video.duration : null;
      resolve({ durationSec: dur != null ? Math.round(dur) : null });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ durationSec: null });
    };
    video.src = url;
  });

const isPhoto = (file: File) => file.type.startsWith("image/");
const isVideo = (file: File) => file.type.startsWith("video/");

const fileToItem = (file: File): MediaUploadItem | null => {
  if (isPhoto(file)) return { type: "photo", contentType: file.type };
  if (isVideo(file)) return { type: "video", contentType: file.type };
  return null;
};

export const usePhotoUpload = (eventId: string) => {
  const qc = useQueryClient();
  const t = useTranslations();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: File[]): Promise<void> => {
    if (files.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      const acceptedFiles: File[] = [];
      const items: MediaUploadItem[] = [];
      for (const file of files) {
        const item = fileToItem(file);
        if (!item) continue;
        acceptedFiles.push(file);
        items.push(item);
      }
      if (items.length === 0) return;

      const { uploadTargets } = await mediaClient.uploadUrls(eventId, items);
      if (uploadTargets.length !== acceptedFiles.length) {
        throw new Error(t("photos__upload__error_no_target"));
      }

      const finalizeItems: MediaFinalizeItem[] = [];
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const target = uploadTargets[i];
        await uploadToTarget(target, file);
        if (target.type === "photo") {
          const dims = await readImageDimensions(file);
          finalizeItems.push({
            mediaId: target.mediaId,
            width: dims?.width ?? null,
            height: dims?.height ?? null,
            sizeBytes: file.size,
          });
        } else {
          const meta = await readVideoMetadata(file);
          finalizeItems.push({
            mediaId: target.mediaId,
            durationSec: meta.durationSec,
            sizeBytes: file.size,
          });
        }
      }

      await mediaClient.finalize(eventId, finalizeItems);

      qc.invalidateQueries({ queryKey: queryKeys.gallery.all(eventId) });
      qc.invalidateQueries({ queryKey: queryKeys.messages.all(eventId) });
      qc.invalidateQueries({ queryKey: queryKeys.events.stats(eventId) });
    } catch (err) {
      console.error("[photos:upload] failed", err);
      const message =
        err instanceof Error ? err.message : t("photos__upload__error_generic");
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
};
