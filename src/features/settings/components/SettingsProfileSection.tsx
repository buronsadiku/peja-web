import { useTranslations } from "next-intl";
import type { Event, User } from "@/lib/api/types";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { ProfileNameForm } from "./ProfileNameForm";
import { WeddingDetailsForm } from "./WeddingDetailsForm";

type SettingsProfileSectionProps = {
  user: User;
  event: Event | null;
};

export const SettingsProfileSection = ({
  user,
  event,
}: SettingsProfileSectionProps) => {
  const t = useTranslations();
  return (
    <>
      <span className="type-overline text-primary">
        {t("settings__profile__eyebrow")}
      </span>
      <h1 className="type-display mt-2 tracking-tight">
        {t("settings__profile__title_a")}{" "}
        <span className="text-primary italic">
          {t("settings__profile__title_b")}
        </span>
      </h1>
      <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
        {t("settings__profile__subtitle")}
      </p>

      <div className="mt-9">
        <SettingsSectionTitle
          title={t("settings__profile__your_account")}
          description={t("settings__profile__your_account_description")}
        />
        <SettingsCard>
          <div className="py-5.5">
            <ProfileNameForm user={user} />
          </div>
        </SettingsCard>
      </div>

      {event ? (
        <div className="mt-11">
          <SettingsSectionTitle
            title={t("settings__profile__wedding_details")}
            description={t("settings__profile__wedding_details_description")}
          />
          <SettingsCard>
            <div className="py-5.5">
              <WeddingDetailsForm event={event} />
            </div>
          </SettingsCard>
        </div>
      ) : (
        <div className="mt-11">
          <SettingsSectionTitle
            title={t("settings__profile__wedding_details")}
            description={t("settings__profile__wedding_details_no_event")}
          />
        </div>
      )}
    </>
  );
};
