"use client";

import { useTranslations } from "next-intl";
import { KioskConfigCard } from "./KioskConfigCard";
import { KioskConfigRow } from "./KioskConfigRow";
import { KioskToggle } from "./KioskToggle";
import { KioskStepSlider } from "./KioskStepSlider";
import { KioskPinInput } from "./KioskPinInput";
import {
  KIOSK_MAX_DURATION_OPTIONS,
  type KioskMaxDurationSeconds,
  type KioskSettings,
  type UpdateKioskSettingsInput,
} from "@/lib/api/types";

const MAX_DURATION_LABELS = ["15s", "30s", "60s", "90s", "2m", "3m"] as const;

type KioskConfigLeftProps = {
  settings: KioskSettings;
  onPatch: (changes: UpdateKioskSettingsInput) => void;
};

export const KioskConfigLeft = ({ settings, onPatch }: KioskConfigLeftProps) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-5">
      <KioskConfigCard
        title={t("kiosk__config__what_section__title")}
        description={t("kiosk__config__what_section__desc")}
      >
        <KioskConfigRow
          title={t("kiosk__config__what__audio__title")}
          description={t("kiosk__config__what__audio__desc")}
        >
          <KioskToggle
            on={settings.captureAudio}
            onChange={(captureAudio) => onPatch({ captureAudio })}
          />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__what__photo__title")}
          description={t("kiosk__config__what__photo__desc")}
        >
          <KioskToggle
            on={settings.capturePhoto}
            onChange={(capturePhoto) => onPatch({ capturePhoto })}
          />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__what__video__title")}
          description={t("kiosk__config__what__video__desc")}
          last
        >
          <KioskToggle
            on={settings.captureVideo}
            onChange={(captureVideo) => onPatch({ captureVideo })}
          />
        </KioskConfigRow>
      </KioskConfigCard>

      <KioskConfigCard
        title={t("kiosk__config__time_section__title")}
        description={t("kiosk__config__time_section__desc")}
      >
        <div className="py-5">
          <div className="flex items-baseline justify-between">
            <span className="type-body-small font-semibold">
              {t("kiosk__config__time__max_label")}
            </span>
            <span className="type-body-small text-foreground font-semibold">
              {settings.maxDurationSeconds < 60
                ? `${settings.maxDurationSeconds}s`
                : `${Math.round(settings.maxDurationSeconds / 60)}m`}
            </span>
          </div>
          <KioskStepSlider<KioskMaxDurationSeconds>
            value={settings.maxDurationSeconds as KioskMaxDurationSeconds}
            steps={KIOSK_MAX_DURATION_OPTIONS}
            labels={MAX_DURATION_LABELS}
            onChange={(maxDurationSeconds) => onPatch({ maxDurationSeconds })}
          />
        </div>
      </KioskConfigCard>

      <KioskConfigCard
        title={t("kiosk__config__lockdown_section__title")}
        description={t("kiosk__config__lockdown_section__desc")}
      >
        <KioskConfigRow
          title={t("kiosk__config__lockdown__fullscreen__title")}
          description={t("kiosk__config__lockdown__fullscreen__desc")}
        >
          <KioskToggle
            on={settings.fullscreenLock}
            onChange={(fullscreenLock) => onPatch({ fullscreenLock })}
          />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__lockdown__pin__title")}
          description={t("kiosk__config__lockdown__pin__desc")}
        >
          <KioskPinInput
            value={settings.exitPin}
            onChange={(exitPin) => onPatch({ exitPin })}
          />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__lockdown__airplane__title")}
          description={t("kiosk__config__lockdown__airplane__desc")}
          last
        >
          <KioskToggle
            on={settings.airplaneMode}
            onChange={(airplaneMode) => onPatch({ airplaneMode })}
          />
        </KioskConfigRow>
      </KioskConfigCard>
    </div>
  );
};
