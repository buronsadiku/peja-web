"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeftIcon } from "@peja/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@peja/icons/ChevronRightIcon";
import { XIcon } from "@peja/icons/XIcon";
import { HeartIcon } from "@peja/icons/HeartIcon";
import { DownloadIcon } from "@peja/icons/DownloadIcon";
import { BookIcon } from "@peja/icons/BookIcon";
import { cn } from "@peja/ui/utils/cn";
import {
  MediaPlayer,
  MediaProvider,
  isHTMLVideoElement,
  type MediaLoadedMetadataEvent,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { useUpdateMedia } from "@/lib/query/galleryQueries";
import type { PhotoView } from "../adapters";

type VideoMime = "video/mp4" | "video/webm";

const mimeFromUrl = (url: string): VideoMime => {
  const ext = extFromUrl(url, "mp4");
  return ext === "webm" ? "video/webm" : "video/mp4";
};

type PhotoLightboxProps = {
  eventId: string;
  photos: PhotoView[];
  index: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  onLoadMore: () => void;
};

const PREFETCH_THRESHOLD = 3;

const sanitizeFilename = (s: string): string =>
  s.replace(/[^\p{L}\p{N}\-_ ]+/gu, "").trim() || "photo";

const extFromUrl = (url: string, fallback: string): string => {
  try {
    const path = new URL(url).pathname;
    const m = path.match(/\.([a-zA-Z0-9]{2,5})$/);
    return m ? m[1].toLowerCase() : fallback;
  } catch {
    return fallback;
  }
};

const downloadAsBlob = async (url: string, filename: string): Promise<void> => {
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

export const PhotoLightbox = ({
  eventId,
  photos,
  index,
  hasNextPage,
  isFetchingNextPage,
  onClose,
  onIndexChange,
  onLoadMore,
}: PhotoLightboxProps) => {
  const t = useTranslations();
  const total = photos.length;
  const photo = photos[index] ?? null;
  const update = useUpdateMedia(eventId);

  const dragStartX = useRef<number | null>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);

  const goPrev = useCallback(() => {
    if (index > 0) onIndexChange(index - 1);
  }, [index, onIndexChange]);

  const goNext = useCallback(() => {
    if (index < total - 1) {
      onIndexChange(index + 1);
    } else if (hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [
    index,
    total,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onIndexChange,
  ]);

  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      index >= total - PREFETCH_THRESHOLD
    ) {
      onLoadMore();
    }
  }, [index, total, hasNextPage, isFetchingNextPage, onLoadMore]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

  if (!photo) return null;

  const fullUrl = photo.url ?? photo.thumbUrl;
  const favorited = photo.isFavorite;
  const inGoldBook = photo.isGoldBookSelected;

  const handleToggleFavorite = () => {
    update.mutate({
      mediaId: photo.id,
      patch: { isFavorite: !favorited },
    });
  };

  const handleToggleGoldBook = () => {
    update.mutate({
      mediaId: photo.id,
      patch: { isGoldBookSelected: !inGoldBook },
    });
  };

  const handleDownload = async () => {
    if (!fullUrl) return;
    try {
      const ext = extFromUrl(fullUrl, "jpg");
      const filename = `${sanitizeFilename(photo.name)}.${ext}`;
      await downloadAsBlob(fullUrl, filename);
    } catch (err) {
      console.error("[lightbox] download failed", err);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartX.current;
    dragStartX.current = null;
    if (start == null) return;
    const dx = e.clientX - start;
    if (dx > 60) goPrev();
    else if (dx < -60) goNext();
  };

  const canGoPrev = index > 0;
  const canGoNext = index < total - 1 || hasNextPage;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("photos__lightbox__aria_label")}
      className="fixed inset-0 z-50 flex flex-col bg-[#1a1a1a]"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-4 py-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="type-body-small font-mono opacity-80">
          {t("photos__lightbox__counter", {
            current: index + 1,
            total,
          })}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={update.isPending}
            aria-label={
              favorited
                ? t("photos__detail__favourited")
                : t("photos__detail__favourite")
            }
            className="hover:bg-white/10 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors disabled:opacity-50"
          >
            <HeartIcon
              width={16}
              height={16}
              className={favorited ? "fill-destructive text-destructive" : ""}
            />
          </button>
          <button
            type="button"
            onClick={handleToggleGoldBook}
            disabled={update.isPending}
            aria-label={
              inGoldBook
                ? t("photos__detail__remove_from_gold_book")
                : t("photos__detail__add_to_gold_book")
            }
            className="hover:bg-white/10 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors disabled:opacity-50"
          >
            <BookIcon
              width={16}
              height={16}
              className={inGoldBook ? "fill-yellow-400 text-yellow-400" : ""}
            />
          </button>
          {fullUrl && (
            <button
              type="button"
              onClick={handleDownload}
              aria-label={t("photos__detail__download")}
              className="hover:bg-white/10 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors"
            >
              <DownloadIcon width={16} height={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t("photos__lightbox__close")}
            className="hover:bg-white/10 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors"
          >
            <XIcon width={16} height={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {fullUrl && photo.type === "video" ? (
          <div className="flex h-full max-h-full w-full max-w-full items-center justify-center">
            <MediaPlayer
              key={fullUrl}
              src={[
                {
                  src: fullUrl,
                  type: mimeFromUrl(fullUrl),
                },
              ]}
              viewType="video"
              streamType="on-demand"
              load="eager"
              preload="metadata"
              onLoadedMetadata={(nativeEvent: MediaLoadedMetadataEvent) => {
                const el = nativeEvent.trigger?.target;
                if (!isHTMLVideoElement(el)) return;
                if (Number.isFinite(el.duration) && el.duration > 0) return;
                const onSeeked = () => {
                  el.removeEventListener("seeked", onSeeked);
                  try {
                    el.currentTime = 0;
                  } catch {
                    /* noop */
                  }
                };
                el.addEventListener("seeked", onSeeked);
                try {
                  el.currentTime = Number.MAX_SAFE_INTEGER;
                } catch {
                  el.removeEventListener("seeked", onSeeked);
                }
              }}
              onError={(detail) => {
                console.error("[video] vidstack error", detail);
              }}
              className="max-h-full max-w-full"
            >
              <MediaProvider />
              <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>
          </div>
        ) : fullUrl ? (
          <img
            src={fullUrl}
            alt={photo.name}
            className="max-h-full max-w-full touch-none object-contain select-none"
            draggable={false}
          />
        ) : (
          <div
            className="rounded-16 flex size-72 items-center justify-center"
            style={{
              background: `linear-gradient(160deg, ${photo.tint}, ${photo.tint}bb)`,
            }}
          >
            <span className="font-serif text-6xl text-black/40">
              {photo.monogram}
            </span>
          </div>
        )}

        {canGoPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label={t("photos__lightbox__prev")}
            className="absolute left-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ChevronLeftIcon width={18} height={18} />
          </button>
        )}
        {canGoNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label={t("photos__lightbox__next")}
            className="absolute right-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ChevronRightIcon width={18} height={18} />
          </button>
        )}
      </div>

      <div
        className="flex flex-col gap-2 px-5 pt-2 pb-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="type-body-small font-serif font-semibold">
              {photo.name}
            </p>
            <p className="type-caption opacity-70">{photo.time}</p>
          </div>
          {isFetchingNextPage && (
            <span className="type-caption opacity-70">
              {t("photos__lightbox__loading_more")}
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-2 overflow-x-auto px-[50%] py-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {photos.map((p, i) => {
            const isActive = i === index;
            return (
              <button
                key={p.id}
                ref={isActive ? activeThumbRef : null}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "rounded-8 relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden transition-all",
                  isActive
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black/90"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                {p.thumbUrl ? (
                  <img
                    src={p.thumbUrl}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  <div
                    className="size-full"
                    style={{
                      background: `linear-gradient(160deg, ${p.tint}, ${p.tint}bb)`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
