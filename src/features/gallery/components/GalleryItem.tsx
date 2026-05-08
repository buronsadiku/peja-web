export type GalleryEntry = {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  caption: string;
};

export const GalleryItem = ({ entry }: { entry: GalleryEntry }) => {
  return (
    <div className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
      <img
        src={entry.imageUrl}
        alt={entry.alt}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-6 left-6">
          <p className="text-white text-lg font-bold">{entry.title}</p>
          <p className="text-gray-300 text-sm">{entry.caption}</p>
        </div>
      </div>
    </div>
  );
};
