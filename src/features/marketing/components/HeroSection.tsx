import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Countdown } from "./Countdown";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1561577862-49a301dda61b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Festival crowd at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 bg-primary/20 backdrop-blur-sm border border-primary px-6 py-3 rounded-full">
            <Calendar className="w-5 h-5 text-primary" />
            <p className="text-primary text-lg">June 18-21, 2026</p>
          </div>
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 text-foreground leading-none drop-shadow-lg">
          PEJA
          <br />
          <span className="text-primary">OUTDOOR</span>
          <br />
          <span className="text-foreground">FESTIVAL</span>
        </h1>

        <p className="text-xl md:text-2xl mb-6 text-muted-foreground max-w-2xl mx-auto">
          Four days of incredible activities and music in the heart of Kosovo
        </p>

        <Countdown />

        <div className="mb-12" />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="group bg-primary text-primary-foreground px-10 py-5 rounded-full text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            Register Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/activities"
            className="bg-foreground/10 backdrop-blur-sm text-foreground border-2 border-foreground/50 px-10 py-5 rounded-full text-lg hover:bg-foreground/20 transition-all text-center"
          >
            View Activities
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};
