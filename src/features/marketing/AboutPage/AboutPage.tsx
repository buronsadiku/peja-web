import { useTranslations } from "next-intl";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@peja/ui/components/Kicker";

export const AboutPage = () => {
  const t = useTranslations();

  return (
    <>
      <section>
        <div className="section-container">
          <Kicker className="text-primary">{t("marketing__about__eyebrow")}</Kicker>
          <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
            <span className="text-foreground block">{t("marketing__about__title_line1")}</span>
            <span className="text-primary block italic">{t("marketing__about__title_line2")}</span>
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__about__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container">
          <div className="border-border bg-card rounded-16 border p-8 tablet:p-12">
            <p className="text-muted-foreground type-body-small font-semibold uppercase tracking-widest">
              {t("marketing__about__mission_label")}
            </p>
            <blockquote className="text-foreground type-body-large mt-4 max-w-prose leading-relaxed font-serif italic">
              {t("marketing__about__mission")}
            </blockquote>
          </div>
        </div>
      </section>

      <section>
        <div className="section-container">
          <Kicker className="text-primary">{t("marketing__about__team_eyebrow")}</Kicker>
          <p className="text-muted-foreground type-body-large mt-4 max-w-130 leading-relaxed">
            {t("marketing__about__team_description")}
          </p>
          <p className="text-muted-foreground type-body-small mt-6">
            {t("marketing__about__founded")}
          </p>
        </div>
      </section>
    </>
  );
};
