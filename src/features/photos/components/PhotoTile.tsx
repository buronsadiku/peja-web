"use client";

import { Checkbox } from "@peja/ui/components/Checkbox";
import { BookIcon } from "@peja/icons/BookIcon";
import { VideoIcon } from "@peja/icons/VideoIcon";
import { cn } from "@peja/ui/utils/cn";
import type { PhotoView } from "../adapters";
import { PhotoFavouriteIndicator } from "./PhotoFavouriteIndicator";

type PhotoTileProps = {
  tile: PhotoView;
  height: number;
  selected?: boolean;
  onClick?: () => void;
  onToggleSelect?: () => void;
};

export const PhotoTile = ({
  tile,
  height,
  selected = false,
  onClick,
  onToggleSelect,
}: PhotoTileProps) => {
  const {
    thumbUrl,
    url,
    type,
    monogram,
    name,
    tint,
    isFavorite,
    isGoldBookSelected,
    time,
  } = tile;
  const isVideo = type === "video";
  const previewUrl = thumbUrl ?? (isVideo ? null : url);
  const favorited = isFavorite;
  const inGoldBook = isGoldBookSelected;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "group rounded-12 relative mb-3 w-full cursor-pointer overflow-hidden text-left transition-transform hover:scale-[1.02] hover:shadow-md",
        selected ? "ring-secondary ring-[3px] ring-offset-1" : "shadow-sm",
      )}
      style={{ breakInside: "avoid" }}
    >
      <div
        className="relative flex w-full items-center justify-center overflow-hidden"
        style={{ height }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={name}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : isVideo && url ? (
          <video
            src={`${url}#t=0.1`}
            preload="none"
            muted
            playsInline
            disablePictureInPicture
            className="size-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(160deg, ${tint}, ${tint}bb)`,
            }}
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.03)_0_8px,transparent_8px_16px)]" />
            <span className="font-serif text-4xl text-black/40">
              {monogram}
            </span>
          </div>
        )}

        {isVideo && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 type-caption font-medium text-white">
            <VideoIcon width={11} height={11} />
            <span>Video</span>
          </span>
        )}

        <span
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="absolute top-2 left-2"
        >
          <Checkbox
            checked={selected}
            onChange={() => onToggleSelect?.()}
            aria-label={`Select photo from ${name}`}
            className="bg-white/90"
          />
        </span>

        <div className="absolute top-2 right-2 flex items-center gap-1">
          {inGoldBook && (
            <BookIcon
              width={16}
              height={16}
              fill="oklch(0.85 0.15 95)"
              stroke="oklch(0.45 0.12 80)"
              strokeWidth={1.5}
            />
          )}
          {favorited && <PhotoFavouriteIndicator />}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="type-caption absolute right-2.5 bottom-2 left-2.5 flex items-baseline justify-between gap-2 font-semibold text-white">
          <span className="truncate">{name}</span>
          <span className="shrink-0 font-mono opacity-85">{time}</span>
        </div>
      </div>
    </div>
  );
};
