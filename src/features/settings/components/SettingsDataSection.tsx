"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { BoxIcon } from "@peja/icons/BoxIcon";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { SettingsToggle } from "./SettingsToggle";
import { ExportHeroCard } from "./ExportHeroCard";
import { PastExportRow } from "./PastExportRow";

const INDIVIDUAL_KEYS = [
  {
    titleKey: "settings__data__individual__audio__title",
    descKey: "settings__data__individual__audio__desc",
  },
  {
    titleKey: "settings__data__individual__transcripts__title",
    descKey: "settings__data__individual__transcripts__desc",
  },
  {
    titleKey: "settings__data__individual__photos__title",
    descKey: "settings__data__individual__photos__desc",
  },
  {
    titleKey: "settings__data__individual__pdf__title",
    descKey: "settings__data__individual__pdf__desc",
  },
  {
    titleKey: "settings__data__individual__guests__title",
    descKey: "settings__data__individual__guests__desc",
  },
];

const PAST_EXPORTS_DATA = [
  {
    date: "Oct 12, 2025",
    titleKey: "settings__data__past__title_archive",
    size: "2.1 GB",
    status: "ready" as const,
  },
  {
    date: "Sep 28, 2025",
    titleKey: "settings__data__past__title_audio",
    size: "1.8 GB",
    status: "expired" as const,
  },
  {
    date: "Sep 14, 2025",
    titleKey: "settings__data__past__title_transcripts",
    size: "3.2 MB",
    status: "ready" as const,
  },
];

export const SettingsDataSection = () => {
  const t = useTranslations();
  return (
    <>
      <span className="type-overline text-primary">
        {t("settings__data__eyebrow")}
      </span>
      <h1 className="type-display mt-2 tracking-tight">
        {t("settings__data__title_a")}{" "}
        <span className="text-primary italic">
          {t("settings__data__title_b")}
        </span>
      </h1>
      <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
        {t("settings__data__subtitle")}
      </p>

      <ExportHeroCard />

      <div className="mt-9">
        <SettingsSectionTitle title={t("settings__data__individual__title")} />
        <SettingsCard>
          {INDIVIDUAL_KEYS.map((entry, i) => (
            <SettingsRow
              key={entry.titleKey}
              title={t(entry.titleKey)}
              description={t(entry.descKey)}
              last={i === INDIVIDUAL_KEYS.length - 1}
            >
              <Button variant="outline" size="sm" className="rounded-full">
                <BoxIcon width={13} height={13} />
                {t("settings__data__download")}
              </Button>
            </SettingsRow>
          ))}
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle title={t("settings__data__past__title")} />
        <SettingsCard>
          {PAST_EXPORTS_DATA.map((item, i) => (
            <PastExportRow
              key={`${item.date}-${item.titleKey}`}
              date={item.date}
              title={t(item.titleKey)}
              size={item.size}
              status={item.status}
              last={i === PAST_EXPORTS_DATA.length - 1}
            />
          ))}
        </SettingsCard>
        <p className="type-caption text-muted-foreground mt-2.5">
          {t("settings__data__past__expiry_note")}
        </p>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle
          title={t("settings__data__rights__title")}
          description={t("settings__data__rights__desc")}
        />
        <SettingsCard>
          <SettingsRow
            title={t("settings__data__rights__report__title")}
            description={t("settings__data__rights__report__desc")}
          >
            <Button variant="outline" size="sm" className="rounded-full">
              {t("settings__data__rights__report__action")}
            </Button>
          </SettingsRow>
          <SettingsRow
            title={t("settings__data__rights__optout__title")}
            description={t("settings__data__rights__optout__desc")}
            last
          >
            <SettingsToggle on={false} />
          </SettingsRow>
        </SettingsCard>
      </div>
    </>
  );
};
