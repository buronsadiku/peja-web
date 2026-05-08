import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type MemoryItem = {
  id: string;
  imageUrl: string;
  alt: string;
  caption: string;
  large?: boolean;
};

const memories: MemoryItem[] = [
  {
    id: "opening",
    imageUrl:
      "https://images.unsplash.com/photo-1561577862-49a301dda61b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
    alt: "Festival crowd dancing",
    caption: "Opening Night 2025",
    large: true,
  },
  {
    id: "live",
    imageUrl:
      "https://images.unsplash.com/photo-1719650932800-ebb72adb2d2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Artist performing",
    caption: "Live Performance",
  },
  {
    id: "stage",
    imageUrl:
      "https://images.unsplash.com/photo-1744292456199-bb080861b95d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Guitarist under lights",
    caption: "Main Stage",
  },
  {
    id: "sunset",
    imageUrl:
      "https://images.unsplash.com/photo-1760135436773-af6c70a4dff4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Sunset silhouettes",
    caption: "Sunset Vibes",
  },
  {
    id: "musicians",
    imageUrl:
      "https://images.unsplash.com/photo-1744292455872-a5b0ff4557bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Guitar close-up",
    caption: "Musicians",
  },
  {
    id: "grounds",
    imageUrl:
      "https://images.unsplash.com/photo-1777109563984-da169e10fa99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Festival pathway",
    caption: "Festival Grounds",
  },
];

const MemoryCard = ({ memory }: { memory: MemoryItem }) => {
  return (
    <div
      className={`relative h-64 rounded-2xl overflow-hidden group cursor-pointer ${
        memory.large ? "col-span-2 row-span-2" : ""
      }`}
    >
      <img
        src={memory.imageUrl}
        alt={memory.alt}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-6 left-6">
          <p className="text-white font-bold">{memory.caption}</p>
        </div>
      </div>
    </div>
  );
};

export const MemoriesSection = () => {
  return (
    <section className="py-24 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-primary">MEMORIES</span>
          </h2>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground">
            Highlights from previous years
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {memories.map((m) => (
            <MemoryCard key={m.id} memory={m} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/gallery"
            className="bg-primary text-primary-foreground px-12 py-4 rounded-full text-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2 group shadow-lg shadow-primary/50"
          >
            View All Photos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
