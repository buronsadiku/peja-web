import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import type { GalleryImage } from "@/lib/api/types";

type MemoryItem = {
  id: string;
  imageUrl: string;
  alt: string;
  caption: string;
};

const toMemory = (img: GalleryImage): MemoryItem => ({
  id: img.id,
  imageUrl: img.url,
  alt: img.alt,
  caption: img.caption ?? img.title ?? "",
});

const MemoryCard = ({
  memory,
  priority,
}: {
  memory: MemoryItem;
  priority: boolean;
}) => {
  return (
    <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
      <img
        src={memory.imageUrl}
        alt={memory.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {memory.caption ? (
          <div className="absolute bottom-6 left-6">
            <p className="text-white font-bold">{memory.caption}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const MemoriesSection = async () => {
  const locale = await getLocale();
  const t = await getTranslations("memories");
  const tc = await getTranslations("common");

  let memories: MemoryItem[] = [];
  try {
    const res = await api.gallery.list({
      showOnLanding: true,
      limit: 12,
    });
    memories = res.data.map(toMemory);
  } catch {
    memories = [];
  }

  void locale;
  if (memories.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-primary">{t("title")}</span>
          </h2>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {memories.map((m, idx) => (
            <MemoryCard key={m.id} memory={m} priority={idx < 4} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/gallery"
            className="bg-primary text-primary-foreground px-12 py-4 rounded-full text-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2 group shadow-lg shadow-primary/50"
          >
            {tc("view_all_photos")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
