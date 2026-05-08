import { useTranslations } from "next-intl";
import type { User } from "@/lib/api/types";
import { NotificationPrefs } from "./NotificationPrefs";

type SettingsNotificationsSectionProps = {
  user: User;
};

export const SettingsNotificationsSection = ({
  user,
}: SettingsNotificationsSectionProps) => {
  const t = useTranslations();
  return (
    <>
      <span className="type-overline text-primary">
        {t("settings__notif__eyebrow")}
      </span>
      <h1 className="type-display mt-2 tracking-tight">
        <span className="text-primary italic">
          {t("settings__notif__title")}
        </span>
      </h1>
      <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
        {t("settings__notif__subtitle")}
      </p>
      <NotificationPrefs user={user} />
    </>
  );
};
