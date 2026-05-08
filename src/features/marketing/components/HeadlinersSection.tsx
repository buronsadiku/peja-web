import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Headliner = {
  name: string;
  genre: string;
  imageUrl: string;
};

const headliners: Headliner[] = [
  {
    name: "THE ELECTRIC WAVES",
    genre: "Electronic / House",
    imageUrl:
      "https://images.unsplash.com/photo-1719650932800-ebb72adb2d2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  },
  {
    name: "LUNA & THE COSMOS",
    genre: "Indie Rock",
    imageUrl:
      "https://images.unsplash.com/photo-1744292456199-bb080861b95d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  },
];

const HeadlinerCard = ({ headliner }: { headliner: Headliner }) => {
  return (
    <div className="relative h-96 rounded-3xl overflow-hidden group cursor-pointer">
      <img
        src={headliner.imageUrl}
        alt={headliner.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="text-4xl font-black text-white mb-2">
          {headliner.name}
        </h3>
        <p className="text-primary text-lg">{headliner.genre}</p>
      </div>
    </div>
  );
};

export const HeadlinersSection = () => {
  return (
    <section id="lineup" className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-primary">HEADLINERS</span>
          </h2>
          <div className="w-24 h-2 bg-primary mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {headliners.map((h) => (
            <HeadlinerCard key={h.name} headliner={h} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/activities"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 transition-all inline-flex items-center gap-2 group"
          >
            View All Activities
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
