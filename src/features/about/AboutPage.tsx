import { ArrowRight, Mountain, Music, Sparkles, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Pillar = {
  icon: typeof Mountain;
  titleKey: string;
  bodyKey: string;
};

const pillars: Pillar[] = [
  {
    icon: Mountain,
    titleKey: "pillar_nature_title",
    bodyKey: "pillar_nature_body",
  },
  {
    icon: Music,
    titleKey: "pillar_sound_title",
    bodyKey: "pillar_sound_body",
  },
  {
    icon: Sparkles,
    titleKey: "pillar_workshops_title",
    bodyKey: "pillar_workshops_body",
  },
  {
    icon: Users,
    titleKey: "pillar_community_title",
    bodyKey: "pillar_community_body",
  },
];

const statKeys = [
  ["stat_visitors_value", "stat_visitors_label"],
  ["stat_activities_value", "stat_activities_label"],
  ["stat_artists_value", "stat_artists_label"],
  ["stat_days_value", "stat_days_label"],
] as const;

const PillarCard = ({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Mountain;
  title: string;
  body: string;
}) => (
  <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all group">
    <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-black mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
  </div>
);

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center p-6 bg-card border border-border rounded-2xl">
    <p className="text-4xl md:text-5xl font-black text-primary mb-2">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export const AboutPage = () => {
  const t = useTranslations("about");
  const tc = useTranslations("common");
  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm uppercase text-primary font-bold tracking-widest mb-4">
            {t("kicker")}
          </p>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            {t("hero_a")} <span className="text-primary">{t("hero_b")}</span>
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("hero_lead")}
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-border">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                alt="Mountains around Peja"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card border-2 border-primary rounded-2xl p-6 shadow-xl shadow-primary/20 max-w-xs">
              <p className="text-3xl font-black text-primary mb-1">
                {t("stat_visitors_value")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("stat_visitors_label")}
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              {t("intro_title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {t("intro_p1")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t("intro_p2")}
            </p>
            <Link
              href="/activities"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 group"
            >
              {tc("see_program")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t("find_title_a")}{" "}
              <span className="text-primary">{t("find_title_b")}</span>
            </h2>
            <div className="w-24 h-2 bg-primary mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p) => (
              <PillarCard
                key={p.titleKey}
                icon={p.icon}
                title={t(p.titleKey)}
                body={t(p.bodyKey)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t("numbers_title_a")}{" "}
              <span className="text-primary">{t("numbers_title_b")}</span>
            </h2>
            <div className="w-24 h-2 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statKeys.map(([valueKey, labelKey]) => (
              <StatCard
                key={valueKey}
                value={t(valueKey)}
                label={t(labelKey)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            {t("outro_title")}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t("outro_subtitle")}
          </p>
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-12 py-4 rounded-full text-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/50 group"
          >
            {tc("register_now")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};
