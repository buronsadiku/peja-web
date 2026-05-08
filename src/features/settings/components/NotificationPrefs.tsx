"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { profileClient } from "@/lib/api/profile-client";
import { ApiError } from "@/lib/api/client";
import type { EmailPreferences, User } from "@/lib/api/types";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsToggle } from "./SettingsToggle";

type NotificationPrefsProps = {
  user: User;
};

const DEFAULT_PREFS: EmailPreferences = {
  marketing: false,
  digest: true,
  alerts: true,
};

const ROW_KEYS: {
  key: keyof EmailPreferences;
  titleKey: string;
  descKey: string;
}[] = [
  {
    key: "alerts",
    titleKey: "settings__notif__alerts__title",
    descKey: "settings__notif__alerts__desc",
  },
  {
    key: "digest",
    titleKey: "settings__notif__digest__title",
    descKey: "settings__notif__digest__desc",
  },
  {
    key: "marketing",
    titleKey: "settings__notif__marketing__title",
    descKey: "settings__notif__marketing__desc",
  },
];

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export const NotificationPrefs = ({ user }: NotificationPrefsProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [prefs, setPrefs] = useState<EmailPreferences>(
    user.emailPreferences ?? DEFAULT_PREFS,
  );
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleToggle = async (key: keyof EmailPreferences) => {
    const next: EmailPreferences = { ...prefs, [key]: !prefs[key] };
    const previous = prefs;
    setPrefs(next);
    setStatus({ kind: "saving" });
    try {
      await profileClient.updateProfile({ emailPreferences: next });
      setStatus({ kind: "saved" });
      router.refresh();
      setTimeout(() => {
        setStatus((s) => (s.kind === "saved" ? { kind: "idle" } : s));
      }, 2000);
    } catch (error) {
      setPrefs(previous);
      setStatus({
        kind: "error",
        message: ApiError.isApiError(error)
          ? error.message
          : t("settings__notif__error"),
      });
    }
  };

  return (
    <div className="mt-9">
      <SettingsSectionTitle title={t("settings__notif__section")} />
      <SettingsCard>
        {ROW_KEYS.map((row, i) => (
          <SettingsRow
            key={row.key}
            title={t(row.titleKey)}
            description={t(row.descKey)}
            last={i === ROW_KEYS.length - 1}
          >
            <SettingsToggle
              on={prefs[row.key]}
              onChange={() => handleToggle(row.key)}
            />
          </SettingsRow>
        ))}
      </SettingsCard>

      <div className="mt-3 flex items-center gap-3">
        {status.kind === "saving" && (
          <span className="type-caption text-muted-foreground">
            {t("settings__notif__saving")}
          </span>
        )}
        {status.kind === "saved" && (
          <span className="type-caption text-secondary">
            {t("settings__notif__saved")}
          </span>
        )}
        {status.kind === "error" && (
          <span className="type-caption text-destructive" role="alert">
            {status.message}
          </span>
        )}
      </div>
    </div>
  );
};
