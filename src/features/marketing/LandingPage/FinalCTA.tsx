import { useTranslations } from "next-intl";
import { SectionTitle } from "../../../components/SectionTitle";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { CheckIcon } from "@peja/icons/CheckIcon";
import { Button } from "@peja/ui/components/Button";
import { Card } from "@peja/ui/components/Card";
import { Kicker } from "@peja/ui/components/Kicker";

export const FinalCTA = () => {
  const t = useTranslations();

  return (
    <section>
      <div className="section-container">
        <div className="from-warm-cream to-warm-panel border-warm-panel relative overflow-hidden rounded-4xl border bg-linear-to-br p-6 shadow-2xl md:p-12 lg:p-[72px_80px]">
          <div className="bg-destructive/30 pointer-events-none absolute -top-30 -right-20 size-90 rounded-full blur-3xl" />
          <div className="bg-primary/25 pointer-events-none absolute -bottom-30 -left-10 size-80 rounded-full blur-3xl" />
          <div className="bg-secondary/20 pointer-events-none absolute top-10 left-[45%] size-45 rounded-full blur-3xl" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="relative">
              <Kicker className="text-destructive">
                {t("marketing__cta__eyebrow")}
              </Kicker>
              <SectionTitle className="text-foreground mt-3.5 leading-none">
                {t("marketing__cta__title_line1")}
                <br />
                <span className="text-primary italic">
                  {t("marketing__cta__title_line2")}
                </span>
              </SectionTitle>
              <p className="text-muted-foreground type-body mt-5 max-w-115 leading-relaxed">
                {t("marketing__cta__description")}
              </p>
            </div>

            <div className="relative">
              <p className="text-muted-foreground type-overline font-bold tracking-widest uppercase">
                {t("marketing__cta__quick_start")}
              </p>

              <Card className="bg-card/75 mt-3 flex items-center gap-2.5 rounded-2xl p-4 shadow-none backdrop-blur">
                <span className="text-muted-foreground bg-card border-border type-caption shrink-0 rounded-full border px-2.5 py-1">
                  {t("marketing__cta__domain_prefix")}
                </span>
                <span className="text-foreground type-body min-w-0 flex-1 truncate font-serif italic">
                  {t("marketing__cta__domain_placeholder")}
                </span>
                <span className="bg-secondary flex size-5.5 shrink-0 items-center justify-center rounded-full">
                  <CheckIcon
                    width={12}
                    height={12}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                </span>
              </Card>

              <Button
                variant="destructive"
                className="bg-destructive mt-3.5 w-full rounded-full shadow-xl"
              >
                {t("marketing__cta__button")}
                <ArrowRightIcon width={16} height={16} />
              </Button>

              <p className="text-muted-foreground type-caption mt-3.5 text-center">
                {t("marketing__cta__disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
