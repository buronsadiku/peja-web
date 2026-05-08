"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Badge } from "@peja/ui/components/Badge";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { SettingsToggle } from "./SettingsToggle";
import { SettingsRadio } from "./SettingsRadio";

export const SettingsPrivacySection = () => {
  const t = useTranslations();
  return (
    <>
      <span className="type-overline text-primary">
        {t("settings__privacy__eyebrow")}
      </span>
      <h1 className="type-display mt-2 tracking-tight">
        {t("settings__privacy__title_a")}{" "}
        <span className="text-primary italic">
          {t("settings__privacy__title_b")}
        </span>
      </h1>
      <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
        {t("settings__privacy__subtitle")}
      </p>

      <div className="mt-9">
        <SettingsSectionTitle
          title={t("settings__privacy__visibility__title")}
        />
        <SettingsCard>
          <SettingsRow
            title={t("settings__privacy__visibility__private__title")}
            description={t("settings__privacy__visibility__private__desc")}
          >
            <SettingsRadio on={true} />
          </SettingsRow>
          <SettingsRow
            title={t("settings__privacy__visibility__unlisted__title")}
            description={t("settings__privacy__visibility__unlisted__desc")}
          >
            <SettingsRadio on={false} />
          </SettingsRow>
          <SettingsRow
            title={t("settings__privacy__visibility__public__title")}
            description={t("settings__privacy__visibility__public__desc")}
            last
          >
            <SettingsRadio on={false} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle title={t("settings__privacy__senders__title")} />
        <SettingsCard>
          <SettingsRow
            title={t("settings__privacy__senders__invited__title")}
            description={t("settings__privacy__senders__invited__desc")}
          >
            <SettingsRadio on={true} />
          </SettingsRow>
          <SettingsRow
            title={t("settings__privacy__senders__anyone__title")}
            description={t("settings__privacy__senders__anyone__desc")}
          >
            <SettingsRadio on={false} />
          </SettingsRow>
          <SettingsRow
            title={t("settings__privacy__senders__signin__title")}
            description={t("settings__privacy__senders__signin__desc")}
            last
          >
            <SettingsToggle on={false} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle title={t("settings__privacy__review__title")} />
        <SettingsCard>
          <SettingsRow
            title={t("settings__privacy__review__before__title")}
            description={t("settings__privacy__review__before__desc")}
          >
            <SettingsToggle on={true} />
          </SettingsRow>
          <SettingsRow
            title={t("settings__privacy__review__flag__title")}
            description={
              <>
                {t("settings__privacy__review__flag__desc_a")}{" "}
                <button
                  type="button"
                  className="text-primary cursor-pointer font-semibold"
                >
                  {t("settings__privacy__review__flag__desc_b")}
                </button>
              </>
            }
          >
            <SettingsToggle on={true} />
          </SettingsRow>
          <SettingsRow
            title={t("settings__privacy__review__autopublish__title")}
            description={t("settings__privacy__review__autopublish__desc")}
            last
          >
            <SettingsToggle on={false} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle
          title={t("settings__privacy__what_guests__title")}
          description={t("settings__privacy__what_guests__desc")}
        />
        <SettingsCard>
          <SettingsRow
            title={t("settings__privacy__what_guests__count__title")}
            description={t("settings__privacy__what_guests__count__desc")}
          >
            <SettingsToggle on={true} />
          </SettingsRow>
          <SettingsRow
            title={t("settings__privacy__what_guests__others__title")}
            description={t("settings__privacy__what_guests__others__desc")}
          >
            <SettingsToggle on={false} />
          </SettingsRow>
          <SettingsRow
            title={t("settings__privacy__what_guests__contributed__title")}
            description={t("settings__privacy__what_guests__contributed__desc")}
            last
          >
            <SettingsToggle on={false} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle title={t("settings__privacy__ai__title")} />
        <SettingsCard>
          <SettingsRow
            title={t("settings__privacy__ai__transcribe__title")}
            description={t("settings__privacy__ai__transcribe__desc")}
          >
            <SettingsToggle on={true} />
          </SettingsRow>
          <SettingsRow
            title={t("settings__privacy__ai__guest_see__title")}
            description={t("settings__privacy__ai__guest_see__desc")}
          >
            <SettingsToggle on={true} />
          </SettingsRow>
          <SettingsRow
            title={t("settings__privacy__ai__suggestions__title")}
            description={t("settings__privacy__ai__suggestions__desc")}
            last
          >
            <Badge variant="secondary">
              {t("settings__privacy__ai__suggestions__badge")}
            </Badge>
            <SettingsToggle on={true} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-10 flex justify-end gap-2.5">
        <Button variant="outline" className="rounded-full">
          {t("settings__privacy__discard")}
        </Button>
        <Button className="rounded-full">{t("settings__privacy__save")}</Button>
      </div>
    </>
  );
};
