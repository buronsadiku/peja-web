import { useTranslations } from "next-intl";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@peja/ui/components/Kicker";
import { ChangelogEntry } from "./ChangelogEntry";
import { CHANGELOG_ENTRY_KEYS } from "./constants";

export const ChangelogPage = () => {
  const t = useTranslations();

  const entries = CHANGELOG_ENTRY_KEYS.map((k) => ({ version: t(k.version), date: t(k.date), description: t(k.description) }));

  return (
    <>
      <section>
        <div className="section-container">
          <Kicker className="text-primary">{t("marketing__changelog__eyebrow")}</Kicker>
          <SectionTitle as="h1" className="mt-4">
            {t("marketing__changelog__title")}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__changelog__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container">
          <div className="max-w-prose">
            {entries.map((entry) => (
              <ChangelogEntry
                key={entry.version}
                version={entry.version}
                date={entry.date}
                description={entry.description}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
