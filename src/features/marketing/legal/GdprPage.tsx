import { useTranslations } from "next-intl";
import { LegalSection } from "./LegalSection";
import { LegalListItem } from "./LegalListItem";

const emailLink = (chunks: React.ReactNode) => (
  <a href={`mailto:${chunks}`} className="text-primary underline underline-offset-4">
    {chunks}
  </a>
);

export const GdprPage = () => {
  const t = useTranslations();

  const dataItems = [
    { label: t("marketing__gdpr__section2_item1_label"), text: t("marketing__gdpr__section2_item1_text") },
    { label: t("marketing__gdpr__section2_item2_label"), text: t("marketing__gdpr__section2_item2_text") },
    { label: t("marketing__gdpr__section2_item3_label"), text: t("marketing__gdpr__section2_item3_text") },
    { label: t("marketing__gdpr__section2_item4_label"), text: t("marketing__gdpr__section2_item4_text") },
    { label: t("marketing__gdpr__section2_item5_label"), text: t("marketing__gdpr__section2_item5_text") },
    { label: t("marketing__gdpr__section2_item6_label"), text: t("marketing__gdpr__section2_item6_text") },
    { label: t("marketing__gdpr__section2_item7_label"), text: t("marketing__gdpr__section2_item7_text") },
  ];

  const legalBasisItems = [
    { label: t("marketing__gdpr__section3_item1_label"), text: t("marketing__gdpr__section3_item1_text") },
    { label: t("marketing__gdpr__section3_item2_label"), text: t("marketing__gdpr__section3_item2_text") },
    { label: t("marketing__gdpr__section3_item3_label"), text: t("marketing__gdpr__section3_item3_text") },
    { label: t("marketing__gdpr__section3_item4_label"), text: t("marketing__gdpr__section3_item4_text") },
  ];

  const sections = [
    { heading: t("marketing__gdpr__section1_heading"), body: t("marketing__gdpr__section1_body") },
    {
      heading: t("marketing__gdpr__section2_heading"),
      body: (
        <>
          <p>{t("marketing__gdpr__section2_intro")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            {dataItems.map((item) => (
              <LegalListItem key={item.label} label={item.label} text={item.text} />
            ))}
          </ul>
        </>
      ),
    },
    {
      heading: t("marketing__gdpr__section3_heading"),
      body: (
        <>
          <p>{t("marketing__gdpr__section3_intro")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            {legalBasisItems.map((item) => (
              <LegalListItem key={item.label} label={item.label} text={item.text} />
            ))}
          </ul>
        </>
      ),
    },
    { heading: t("marketing__gdpr__section4_heading"), body: t.rich("marketing__gdpr__section4_body", { link: emailLink }) },
    { heading: t("marketing__gdpr__section5_heading"), body: t("marketing__gdpr__section5_body") },
    { heading: t("marketing__gdpr__section6_heading"), body: t("marketing__gdpr__section6_body") },
    { heading: t("marketing__gdpr__section7_heading"), body: t.rich("marketing__gdpr__section7_body", { link: emailLink }) },
  ];

  return (
    <section>
      <div className="section-container">
        <div className="max-w-prose">
          <h1 className="type-h0 text-foreground font-semibold">{t("marketing__gdpr__title")}</h1>
          <p className="text-muted-foreground type-body mt-2">{t("marketing__gdpr__subtitle")}</p>
          <p className="text-muted-foreground type-body-small mt-1">{t("marketing__gdpr__last_updated")}</p>
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
