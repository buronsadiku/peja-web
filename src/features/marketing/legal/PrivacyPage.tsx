import { useTranslations } from "next-intl";
import { LegalSection } from "./LegalSection";

const emailLink = (chunks: React.ReactNode) => (
  <a href={`mailto:${chunks}`} className="text-primary underline underline-offset-4">
    {chunks}
  </a>
);

export const PrivacyPage = () => {
  const t = useTranslations();

  const sections = [
    { heading: t("marketing__privacy__section1_heading"), body: t("marketing__privacy__section1_body") },
    { heading: t("marketing__privacy__section2_heading"), body: t("marketing__privacy__section2_body") },
    { heading: t("marketing__privacy__section3_heading"), body: t("marketing__privacy__section3_body") },
    { heading: t("marketing__privacy__section4_heading"), body: t("marketing__privacy__section4_body") },
    { heading: t("marketing__privacy__section5_heading"), body: t("marketing__privacy__section5_body") },
    { heading: t("marketing__privacy__section6_heading"), body: t("marketing__privacy__section6_body") },
    { heading: t("marketing__privacy__section7_heading"), body: t.rich("marketing__privacy__section7_body", { link: emailLink }) },
    { heading: t("marketing__privacy__section8_heading"), body: t.rich("marketing__privacy__section8_body", { link: emailLink }) },
  ];

  return (
    <section>
      <div className="section-container">
        <div className="max-w-prose">
          <h1 className="type-h0 text-foreground font-semibold">{t("marketing__privacy__title")}</h1>
          <p className="text-muted-foreground type-body-small mt-2">{t("marketing__privacy__last_updated")}</p>
          <div className="mt-10">
            {sections.map((s) => (
              <LegalSection key={s.heading} heading={s.heading} body={s.body} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
