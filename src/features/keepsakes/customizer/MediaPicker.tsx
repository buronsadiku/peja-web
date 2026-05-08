"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mediaClient } from "@/lib/api/media-client";
import { ApiError } from "@/lib/api/client";
import { Button } from "@peja/ui/components/Button";
import { MediaPickerTile } from "./MediaPickerTile";
import { PickerSkeleton } from "./PickerSkeleton";
import { SourceFilterTabs, type SourceFilter } from "./SourceFilterTabs";
import { usePhotoUpload } from "@/features/photos/hooks/usePhotoUpload";
import type { GalleryItem } from "@/lib/api/types";

type MediaPickerProps = {
  eventId: string | null;
  type: "photo" | "video" | "all";
  selectedIds: string[];
  onToggle: (id: string) => void;
  emptyHint: string;
};

export const MediaPicker = ({
  eventId,
  type,
  selectedIds,
  onToggle,
  emptyHint,
}: MediaPickerProps) => {
  const [source, setSource] = useState<SourceFilter>("all");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { upload, isUploading, error: uploadError } = usePhotoUpload(
    eventId ?? "",
  );

  const fetchGallery = useCallback(() => {
    if (!eventId) return;
    const reqId = ++requestIdRef.current;
    setRefreshing(true);
    setError(null);
    mediaClient
      .gallery(eventId, {
        type,
        filter: source,
        limit: 100,
        sort: "newest",
      })
      .then((result) => {
        if (reqId !== requestIdRef.current) return;
        setItems(result.items);
        setHasLoadedOnce(true);
      })
      .catch((err) => {
        if (reqId !== requestIdRef.current) return;
        setError(
          ApiError.isApiError(err) ? err.message : "Could not load media",
        );
      })
      .finally(() => {
        if (reqId === requestIdRef.current) setRefreshing(false);
      });
  }, [eventId, type, source]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !eventId) return;
    await upload(Array.from(files));
    fetchGallery();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const acceptTypes =
    type === "video"
      ? "video/*"
      : type === "photo"
        ? "image/*"
        : "image/*,video/*";

  if (!eventId) return null;

  const showInitialLoading = !hasLoadedOnce && refreshing;
  const showEmpty = hasLoadedOnce && !error && items.length === 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SourceFilterTabs value={source} onChange={setSource} />
        <div className="flex items-center gap-2">
          {refreshing && hasLoadedOnce && !isUploading && (
            <span
              className="type-caption text-muted-foreground tracking-wider"
              role="status"
            >
              Updating…
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptTypes}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full"
          >
            {isUploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>
      {(error || uploadError) && (
        <p className="type-body-small text-destructive" role="alert">
          {error ?? uploadError}
        </p>
      )}
      {showInitialLoading && <PickerSkeleton variant="tiles" count={10} />}
      {showEmpty && (
        <p className="type-body-small text-muted-foreground">{emptyHint}</p>
      )}
      {items.length > 0 && (
        <div
          className={`mobile:grid-cols-3 tablet:grid-cols-4 desktop:grid-cols-5 grid grid-cols-2 gap-2 transition-opacity ${
            refreshing ? "opacity-60" : "opacity-100"
          }`}
        >
          {items.map((item) => (
            <MediaPickerTile
              key={item.id}
              item={item}
              selected={selectedIds.includes(item.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
