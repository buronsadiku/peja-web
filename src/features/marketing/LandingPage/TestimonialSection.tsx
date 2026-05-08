import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { SectionTitle } from "../../../components/SectionTitle";
import { StatCard } from "@peja/ui/components/StatCard";
import { STAT_KEYS } from "./constants";

export const TestimonialSection = () => {
  const t = useTranslations();

  const stats = STAT_KEYS.map((k) => ({
    value: t(k.value),
    label: t(k.label),
  }));

  return (
    <section className="from-primary to-primary/80 text-primary-foreground relative overflow-hidden bg-linear-to-br">
      <div className="dark:bg-background/90 pointer-events-none absolute inset-0" />
      <div className="bg-destructive/30 pointer-events-none absolute -top-25 -right-20 size-100 rounded-full blur-3xl" />
      <div className="bg-accent/25 pointer-events-none absolute -bottom-20 -left-15 size-80 rounded-full blur-3xl" />

      <div className="section-container relative">
        <Kicker className="mb-6 opacity-75">
          {t("marketing__testimonial__eyebrow")}
        </Kicker>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[2fr_1fr]">
          <div>
            <SectionTitle
              as="blockquote"
              className="type-h2 tablet:type-h1 font-medium italic"
            >
              {t("marketing__testimonial__quote")}
            </SectionTitle>
            <div className="mt-10 flex items-center gap-4">
              <div className="bg-accent/60 type-body-large flex size-13 shrink-0 items-center justify-center rounded-full font-serif font-bold">
                {t("marketing__testimonial__couple_initials")}
              </div>
              <div>
                <p className="type-body font-semibold">
                  {t("marketing__testimonial__couple_name")}
                </p>
                <p className="type-body-small opacity-80">
                  {t("marketing__testimonial__couple_detail")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                className="rounded-2xl border-white/18 bg-white/10 text-white shadow-none backdrop-blur"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
