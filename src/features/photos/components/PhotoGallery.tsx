"use client";

import { useTranslations } from "next-intl";
import { heightFor, type PhotoView } from "../adapters";
import { PhotoTile } from "./PhotoTile";

type PhotoGalleryProps = {
  photos: PhotoView[];
  selectedIds: Set<string>;
  onTileClick: (id: string) => void;
  onToggleSelect: (id: string) => void;
};

export const PhotoGallery = ({
  photos,
  selectedIds,
  onTileClick,
  onToggleSelect,
}: PhotoGalleryProps) => {
  const t = useTranslations();

  if (photos.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
        <p className="type-h2 font-semibold">
          {t("photos__empty_title")}
        </p>
        <p className="type-body-small text-muted-foreground mt-2 max-w-sm">
          {t("photos__empty_body")}
        </p>
      </div>
    );
  }

  return (
    <div className="tablet:p-6 p-4">
      <div className="tablet:columns-3 large-desktop:columns-4 columns-2 gap-3">
        {photos.map((tile, i) => (
          <PhotoTile
            key={tile.id}
            tile={tile}
            height={heightFor(i)}
            selected={selectedIds.has(tile.id)}
            onClick={() => onTileClick(tile.id)}
            onToggleSelect={() => onToggleSelect(tile.id)}
          />
        ))}
      </div>
    </div>
  );
};
