"use client";

import { CheckIcon } from "@peja/icons/CheckIcon";
import type { GalleryItem } from "@/lib/api/types";

type MediaPickerTileProps = {
  item: GalleryItem;
  selected: boolean;
  onToggle: (id: string) => void;
};

export const MediaPickerTile = ({
  item,
  selected,
  onToggle,
}: MediaPickerTileProps) => {
  const thumb = item.thumbUrl ?? item.url;
  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      className={`rounded-12 relative aspect-square overflow-hidden border-2 ${
        selected ? "border-primary" : "border-transparent"
      }`}
    >
      {thumb ? (
        <img
          src={thumb}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="bg-muted h-full w-full" />
      )}
      {item.type === "video" && (
        <span className="type-caption bg-foreground/70 text-background rounded-8 absolute bottom-1.5 right-1.5 px-1.5 py-0.5">
          Video
        </span>
      )}
      {selected && (
        <span className="bg-primary text-primary-foreground absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full">
          <CheckIcon width={14} height={14} />
        </span>
      )}
    </button>
  );
};
