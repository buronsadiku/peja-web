import type { GalleryImage } from "@/lib/api/types";

export const GalleryItem = ({ entry }: { entry: GalleryImage }) => {
  return (
    <div className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
      <img
        src={entry.url}
        alt={entry.alt}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-6 left-6">
          {entry.title ? (
            <p className="text-white text-lg font-bold">{entry.title}</p>
          ) : null}
          {entry.caption ? (
            <p className="text-gray-300 text-sm">{entry.caption}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
