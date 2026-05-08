import type { GalleryImage } from "@/lib/api/types";
import { GalleryItem } from "./GalleryItem";

type GallerySectionProps = {
  title: string;
  entries: GalleryImage[];
};

export const GallerySection = ({ title, entries }: GallerySectionProps) => {
  if (entries.length === 0) return null;

  return (
    <div className="mb-20">
      <h2 className="text-4xl md:text-5xl font-black mb-8 text-primary">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <GalleryItem key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};
