import { ArrowRight, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Countdown } from "./Countdown";

export const HeroSection = () => {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  return (
    <section
      id="home"
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          className="h-full w-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="bg-background/60 absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-24 text-center">
        <div className="mb-8">
          <div className="bg-primary/20 border-primary inline-flex items-center gap-3 rounded-full border px-6 py-3 backdrop-blur-sm">
            <Calendar className="text-primary h-5 w-5" />
            <p className="text-primary text-lg">{t("date")}</p>
          </div>
        </div>

        <h1 className="text-foreground mb-6 text-6xl leading-none font-black drop-shadow-lg sm:text-7xl md:text-8xl lg:text-9xl">
          PEJA
          <br />
          <span className="text-primary">OUTDOOR</span>
          <br />
          <span className="text-foreground">FESTIVAL</span>
        </h1>

        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-xl md:text-2xl">
          {t("subtitle")}
        </p>

        <Countdown />

        <div className="mb-12" />

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="group bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-full px-10 py-5 text-lg transition-all"
          >
            {tc("register_now")}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/activities"
            className="bg-foreground/10 text-foreground border-foreground/50 hover:bg-foreground/20 rounded-full border-2 px-10 py-5 text-center text-lg backdrop-blur-sm transition-all"
          >
            {tc("view_activities")}
          </Link>
        </div>
      </div>
    </section>
  );
};
