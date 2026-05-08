import { useTranslations } from "next-intl";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@peja/ui/components/Kicker";
import { ContactRow } from "./ContactRow";
import { CONTACT_ROW_KEYS } from "./constants";

export const ContactPage = () => {
  const t = useTranslations();

  const rows = CONTACT_ROW_KEYS.map((k) => ({ label: t(k.label), email: t(k.email) }));

  return (
    <>
      <section>
        <div className="section-container">
          <Kicker className="text-primary">{t("marketing__contact__eyebrow")}</Kicker>
          <SectionTitle as="h1" className="mt-4">
            {t("marketing__contact__title")}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__contact__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container">
          <div className="max-w-prose">
            {rows.map((row) => (
              <ContactRow key={row.label} label={row.label} email={row.email} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
