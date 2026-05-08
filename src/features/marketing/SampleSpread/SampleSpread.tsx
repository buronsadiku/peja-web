import { useTranslations } from "next-intl";
import { Card } from "@peja/ui/components/Card";
import { Kicker } from "@peja/ui/components/Kicker";
import { SampleAudio } from "./SampleAudio";
import { SectionTitle } from "@/components/SectionTitle";
import { Badge } from "@peja/ui/components/Badge";
import { SAMPLE_STAT_KEYS } from "./constants";

type Stat = { value: string; label: string };

const StatItem = ({ value, label }: Stat) => (
  <div>
    <p className="text-primary type-h1 font-semibold tracking-tight">{value}</p>
    <p className="text-muted-foreground type-caption mt-1 leading-snug">
      {label}
    </p>
  </div>
);

export const SampleSpread = () => {
  const t = useTranslations();

  const stats: Stat[] = SAMPLE_STAT_KEYS.map((k) => ({ value: t(k.value), label: t(k.label) }));

  return (
    <section>
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <div>
            <Kicker className="text-primary mb-4">
              {t("marketing__sample__eyebrow")}
            </Kicker>
            <SectionTitle>
              {t("marketing__sample__title_start")}{" "}
              <span className="italic">
                {t("marketing__sample__title_end")}
              </span>
            </SectionTitle>
            <p className="text-muted-foreground type-body-large mt-5 max-w-125 leading-relaxed">
              {t("marketing__sample__description")}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-5">
              {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </div>
          </div>

          <Card className="relative rounded-3xl p-10 shadow-xl">
            <Badge className="bg-destructive absolute -top-3.5 left-1/2 w-fit -translate-x-1/2 py-1.5 whitespace-nowrap shadow-md">
              {t("marketing__sample__saved_tag")}
            </Badge>

            <p className="text-muted-foreground type-overline mb-4 font-bold tracking-widest uppercase">
              {t("marketing__sample__entry_label")}
            </p>

            <blockquote className="type-h3 tablet:type-h2 leading-snug font-medium italic">
              {t("marketing__sample__quote")}
            </blockquote>

            <div className="border-border my-6 border-t border-dashed" />

            <div className="tablet:flex-row flex flex-col items-center gap-3.5">
              <div className="flex items-center gap-3.5">
                <div className="from-accent to-accent/70 flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br">
                  <span className="text-primary-foreground type-body-small font-serif font-semibold">
                    AC
                  </span>
                </div>

                <p className="text-foreground type-body-small leading-tight font-semibold">
                  {t("marketing__sample__author_name")}
                </p>
              </div>
              <div className="flex items-center gap-3.5">
                <p className="text-muted-foreground type-caption mt-0.5">
                  {t("marketing__sample__author_role")}
                </p>

                <SampleAudio />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
