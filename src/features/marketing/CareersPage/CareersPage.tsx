import { useTranslations } from "next-intl";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@peja/ui/components/Kicker";
import { CareerValue } from "./CareerValue";
import { CAREER_VALUE_KEYS } from "./constants";

export const CareersPage = () => {
  const t = useTranslations();

  const values = CAREER_VALUE_KEYS.map((k) => ({ title: t(k.title), body: t(k.body) }));

  return (
    <>
      <section>
        <div className="section-container">
          <Kicker className="text-primary">{t("marketing__careers__eyebrow")}</Kicker>
          <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
            <span className="text-foreground block">{t("marketing__careers__title_line1")}</span>
            <span className="text-primary block italic">{t("marketing__careers__title_line2")}</span>
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__careers__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container">
          <Kicker className="text-primary">{t("marketing__careers__values_eyebrow")}</Kicker>
          <div className="mt-8 grid grid-cols-1 gap-6 tablet:grid-cols-2">
            {values.map((v) => (
              <CareerValue key={v.title} title={v.title} body={v.body} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-container">
          <Kicker className="text-primary">{t("marketing__careers__open_eyebrow")}</Kicker>
          <p className="text-muted-foreground type-body mt-4 max-w-prose leading-relaxed">
            {t("marketing__careers__no_openings")}
          </p>
          <a
            href={`mailto:${t("marketing__careers__email")}`}
            className="text-primary type-body mt-4 inline-block font-semibold underline underline-offset-4"
          >
            {t("marketing__careers__speculative")}
          </a>
        </div>
      </section>
    </>
  );
};
