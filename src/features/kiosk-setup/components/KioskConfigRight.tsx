"use client";

import { useTranslations } from "next-intl";
import { KioskConfigCard } from "./KioskConfigCard";
import { KioskConfigRow } from "./KioskConfigRow";
import { KioskToggle } from "./KioskToggle";
import { KioskSelect } from "./KioskSelect";
import { KioskWelcomeNote } from "./KioskWelcomeNote";
import { KioskLanguagePicker } from "./KioskLanguagePicker";
import {
  KIOSK_OFFLINE_STORAGE_OPTIONS,
  type KioskOfflineStorageMb,
  type KioskSettings,
  type UpdateKioskSettingsInput,
} from "@/lib/api/types";

const formatStorage = (mb: number) =>
  mb >= 1000 ? `${mb / 1000} GB` : `${mb} MB`;

type KioskConfigRightProps = {
  settings: KioskSettings;
  onPatch: (changes: UpdateKioskSettingsInput) => void;
};

export const KioskConfigRight = ({
  settings,
  onPatch,
}: KioskConfigRightProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-5">
      <KioskConfigCard
        title={t("kiosk__config__welcome_section__title")}
        description={t("kiosk__config__welcome_section__desc")}
      >
        <KioskWelcomeNote
          value={settings.welcomeNote ?? ""}
          onChange={(welcomeNote) =>
            onPatch({ welcomeNote: welcomeNote.length === 0 ? null : welcomeNote })
          }
        />
        <KioskConfigRow
          title={t("kiosk__config__welcome__lang_picker__title")}
          description={t("kiosk__config__welcome__lang_picker__desc")}
          last
        >
          <KioskToggle
            on={settings.welcomeShowLanguagePicker}
            onChange={(welcomeShowLanguagePicker) =>
              onPatch({ welcomeShowLanguagePicker })
            }
          />
        </KioskConfigRow>
      </KioskConfigCard>

      <KioskConfigCard
        title={t("kiosk__config__languages_section__title")}
        description={t("kiosk__config__languages_section__desc")}
      >
        <KioskLanguagePicker
          defaultLanguage={settings.defaultLanguage}
          supportedLanguages={settings.supportedLanguages}
          onChange={onPatch}
        />
      </KioskConfigCard>

      <KioskConfigCard
        title={t("kiosk__config__offline_section__title")}
        description={t("kiosk__config__offline_section__desc")}
      >
        <KioskConfigRow
          title={t("kiosk__config__offline__store__title")}
          description={t("kiosk__config__offline__store__desc")}
        >
          <KioskToggle
            on={settings.offlineStore}
            onChange={(offlineStore) => onPatch({ offlineStore })}
          />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__offline__storage__title")}
          description={t("kiosk__config__offline__storage__desc")}
        >
          <KioskSelect<KioskOfflineStorageMb>
            value={settings.offlineStorageMb as KioskOfflineStorageMb}
            options={KIOSK_OFFLINE_STORAGE_OPTIONS.map((mb) => ({
              value: mb,
              label: formatStorage(mb),
            }))}
            onChange={(offlineStorageMb) => onPatch({ offlineStorageMb })}
          />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__offline__notify__title")}
          description={t("kiosk__config__offline__notify__desc")}
          last
        >
          <KioskToggle
            on={settings.offlineNotify}
            onChange={(offlineNotify) => onPatch({ offlineNotify })}
          />
        </KioskConfigRow>
      </KioskConfigCard>
    </div>
  );
};
