import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GallerySection } from "./components/GallerySection";
import {
  adventures,
  foodAndWine,
  livePerformances,
  workshops,
} from "./data/gallery";

export const GalleryPage = () => {
  return (
    <div className="pt-24 min-h-screen bg-background">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            FESTIVAL <span className="text-primary">GALLERY</span>
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Relive the best moments from our previous festivals
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <GallerySection
            title="Live Performances"
            entries={livePerformances}
          />
          <GallerySection title="Workshops & Activities" entries={workshops} />
          <GallerySection title="Mountain Adventures" entries={adventures} />
          <GallerySection title="Food & Wine Tasting" entries={foodAndWine} />
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Be Part of the Next Story
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join us and create your own memories
          </p>
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-12 py-4 rounded-full text-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/50"
          >
            Register Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
