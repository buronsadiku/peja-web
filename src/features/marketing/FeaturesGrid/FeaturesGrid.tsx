import { useTranslations } from "next-intl";
import { Badge } from "@peja/ui/components/Badge";
import { Kicker } from "@peja/ui/components/Kicker";
import { LockIcon } from "@peja/icons/LockIcon";
import { FeaturesRitualBar } from "./FeaturesRitualBar";
import { FeaturesQrCard } from "./FeaturesQrCard";
import { SectionTitle } from "../../../components/SectionTitle";
import { FeatureCard } from "./FeatureCard";
import {
  GOLD_BOOK_PRICE,
  INTEGRATIONS,
  LANGUAGES,
  QR_ROTATIONS,
  RITUAL_BARS,
} from "./constants";

export const FeaturesGrid = () => {
  const t = useTranslations();

  return (
    <section>
      <div className="section-container">
        <div className="mb-12 flex flex-col items-center">
          <Kicker className="text-primary mb-4">
            {t("marketing__features__eyebrow")}
          </Kicker>
          <SectionTitle className="mx-auto max-w-205 text-center leading-tight">
            {t("marketing__features__title_line1")}{" "}
            <span className="text-primary italic">
              {t("marketing__features__title_line2")}
            </span>
          </SectionTitle>
        </div>

        <div className="grid grid-cols-1 gap-4.5 md:grid-cols-4">
          <FeatureCard
            kicker={t("marketing__features__ritual_eyebrow")}
            kickerClassName="text-muted-foreground"
            title={t("marketing__features__ritual_title")}
            titleClassName="type-h2 tablet:type-h1"
            className="md:col-span-2"
          >
            <p className="text-muted-foreground type-body-small mt-2">
              {t("marketing__features__ritual_body")}
            </p>
            <div className="tablet:mt-auto mt-2 flex items-end gap-0.5">
              {RITUAL_BARS.map((i) => (
                <FeaturesRitualBar key={i} index={i} />
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__lang_eyebrow")}
            kickerClassName="text-destructive"
            title={t("marketing__features__lang_title")}
            className="bg-destructive/10"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <Badge key={lang} variant="outline">
                  {lang}
                </Badge>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__book_eyebrow")}
            kickerClassName="text-accent"
            title={t("marketing__features__book_title")}
            className="bg-accent/15"
          >
            <div className="mt-auto flex items-center gap-3">
              <div className="from-accent to-accent/70 flex h-20 w-15 items-center justify-center rounded-r-lg bg-linear-to-br shadow-md">
                <span className="text-primary-foreground type-h2 font-bold">
                  O
                </span>
              </div>
              <div>
                <p className="text-foreground type-body-small font-semibold">
                  {t("marketing__features__book_price", {
                    price: GOLD_BOOK_PRICE,
                  })}
                </p>
                <p className="text-muted-foreground type-caption">
                  {t("marketing__features__book_shipping")}
                </p>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__privacy_eyebrow")}
            kickerClassName="text-secondary"
            title={t("marketing__features__privacy_title")}
            className="bg-secondary/15"
          >
            <div className="text-muted-foreground type-caption mt-auto flex items-center gap-2">
              <LockIcon className="size-3.5 shrink-0" />
              <span>{t("marketing__features__privacy_detail")}</span>
            </div>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__qr_eyebrow")}
            kickerClassName="text-muted-foreground"
            title={t("marketing__features__qr_title")}
          >
            <div className="mt-auto flex items-end gap-1">
              {QR_ROTATIONS.map((rotation, i) => (
                <FeaturesQrCard key={i} rotation={rotation} />
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__planner_eyebrow")}
            kickerClassName="text-primary"
            title={t("marketing__features__planner_title")}
            titleClassName="type-h2 mb-3"
            className="bg-primary/10 md:col-span-2"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {INTEGRATIONS.map((name) => (
                <Badge key={name} variant="outline">
                  {name}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground type-body-small">
              {t("marketing__features__planner_body")}
            </p>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};
