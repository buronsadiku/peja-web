import { useTranslations } from "next-intl";
import { LegalSection } from "../LegalSection";
import { CookieType } from "./CookieType";
import { COOKIE_TYPE_KEYS } from "./constants";

const emailLink = (chunks: React.ReactNode) => (
  <a href={`mailto:${chunks}`} className="text-primary underline underline-offset-4">
    {chunks}
  </a>
);

export const CookiesPage = () => {
  const t = useTranslations();

  const cookieTypes = COOKIE_TYPE_KEYS.map((k) => ({ label: t(k.label), body: t(k.body) }));

  const sections = [
    { heading: t("marketing__cookies__section1_heading"), body: t("marketing__cookies__section1_body") },
    {
      heading: t("marketing__cookies__section2_heading"),
      body: cookieTypes.map((ct) => (
        <CookieType key={ct.label} label={ct.label} body={ct.body} />
      )),
    },
    { heading: t("marketing__cookies__section3_heading"), body: t.rich("marketing__cookies__section3_body", { link: emailLink }) },
  ];

  return (
    <section>
      <div className="section-container">
        <div className="max-w-prose">
          <h1 className="type-h0 text-foreground font-semibold">{t("marketing__cookies__title")}</h1>
          <p className="text-muted-foreground type-body-small mt-2">{t("marketing__cookies__last_updated")}</p>
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
