import {
  initialsFrom,
  tintFrom,
  formatTimeShort,
} from "@/features/messages/adapters";
import type { GalleryItem } from "@/lib/api/types";

export type PhotoView = GalleryItem & {
  name: string;
  monogram: string;
  tint: string;
  time: string;
};

const HEIGHTS = [260, 200, 300, 240, 220, 280, 340, 200];

export const heightFor = (index: number): number =>
  HEIGHTS[index % HEIGHTS.length]!;

export const toPhotoViewFromGallery = (
  item: GalleryItem,
  anonymousLabel: string,
): PhotoView => {
  const name = item.uploaderName?.trim() || anonymousLabel;
  return {
    ...item,
    name,
    monogram: initialsFrom(name),
    tint: tintFrom(item.id),
    time: formatTimeShort(item.createdAt),
  };
};
