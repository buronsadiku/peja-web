"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { WarningIcon } from "@peja/icons/WarningIcon";
import { useRouter } from "@/i18n/navigation";
import { eventsClient } from "@/lib/api/events-client";
import { profileClient } from "@/lib/api/profile-client";
import { ApiError } from "@/lib/api/client";
import { appRoutes } from "@/lib/routes";
import type { Event, User } from "@/lib/api/types";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { DeleteBookModal } from "./DeleteBookModal";

type SettingsDangerSectionProps = {
  user: User;
  event: Event | null;
};

const coupleNameOf = (event: Event) =>
  [event.partnerAName, event.partnerBName].filter(Boolean).join(" & ");

export const SettingsDangerSection = ({
  user,
  event,
}: SettingsDangerSectionProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pending, setPending] = useState<
    null | "archive" | "deleteBook" | "deleteAccount"
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleArchive = async () => {
    if (!event) return;
    if (
      !window.confirm(
        t("settings__danger__archive_confirm", { name: coupleNameOf(event) }),
      )
    ) {
      return;
    }
    setPending("archive");
    setError(null);
    try {
      await eventsClient.archive(event.id);
      router.refresh();
    } catch (e) {
      setError(
        ApiError.isApiError(e)
          ? e.message
          : t("settings__danger__archive_error"),
      );
    } finally {
      setPending(null);
    }
  };

  const handleDeleteBook = async () => {
    if (!event) return;
    setPending("deleteBook");
    setError(null);
    try {
      await eventsClient.remove(event.id);
      setShowDeleteModal(false);
      router.replace(appRoutes.app.root);
      router.refresh();
    } catch (e) {
      setError(
        ApiError.isApiError(e)
          ? e.message
          : t("settings__danger__delete_book_error"),
      );
    } finally {
      setPending(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t("settings__danger__close_account_confirm"))) {
      return;
    }
    setPending("deleteAccount");
    setError(null);
    try {
      await profileClient.deleteAccount();
      await fetch("/api/auth/signout", { method: "POST" });
      router.replace(appRoutes.auth.signIn);
      router.refresh();
    } catch (e) {
      setError(
        ApiError.isApiError(e)
          ? e.message
          : t("settings__danger__close_account_error"),
      );
      setPending(null);
    }
  };

  return (
    <>
      <span className="type-overline text-destructive">
        {t("settings__danger__eyebrow")}
      </span>
      <h1 className="type-display mt-2 tracking-tight">
        {t("settings__danger__title_a")}{" "}
        <span className="text-destructive italic">
          {t("settings__danger__title_b")}
        </span>
      </h1>
      <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
        {t("settings__danger__subtitle")}
      </p>

      {error && (
        <p className="type-body-small text-destructive mt-6" role="alert">
          {error}
        </p>
      )}

      {event && (
        <div className="mt-9">
          <SettingsSectionTitle
            title={t("settings__danger__archive_section")}
          />
          <div className="rounded-16 border-destructive/30 overflow-hidden border-2">
            <div
              className="type-overline text-destructive flex items-center gap-2.5 px-5 py-3"
              style={{
                background:
                  "repeating-linear-gradient(135deg, var(--destructive) / 0.08 0 12px, var(--destructive) / 0.14 12px 24px)",
              }}
            >
              <WarningIcon width={14} height={14} />
              {t("settings__danger__final_warning")}
            </div>
            <div className="bg-card px-7">
              <SettingsRow
                title={t("settings__danger__archive_title")}
                description={t("settings__danger__archive_description")}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleArchive}
                  disabled={
                    pending === "archive" || event.status === "archived"
                  }
                  className="border-destructive/40 text-destructive rounded-full"
                >
                  {event.status === "archived"
                    ? t("settings__danger__archive_already")
                    : pending === "archive"
                      ? t("settings__danger__archive_pending")
                      : t("settings__danger__archive_action")}
                </Button>
              </SettingsRow>
              <SettingsRow
                title={
                  <span className="text-destructive">
                    {t("settings__danger__delete_book_title")}
                  </span>
                }
                description={t("settings__danger__delete_book_description")}
                warn
                last
              >
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <WarningIcon width={13} height={13} />
                  {t("settings__danger__delete_book_action")}
                </Button>
              </SettingsRow>
            </div>
          </div>
        </div>
      )}

      <div className="mt-9">
        <SettingsSectionTitle
          title={t("settings__danger__account_section")}
          description={t("settings__danger__account_description")}
        />
        <SettingsCard>
          <SettingsRow
            title={t("settings__danger__close_account_title")}
            description={t("settings__danger__close_account_description", {
              email: user.email,
            })}
            warn
            last
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAccount}
              disabled={pending === "deleteAccount"}
              className="border-destructive/40 text-destructive rounded-full"
            >
              {pending === "deleteAccount"
                ? t("settings__danger__close_account_pending")
                : t("settings__danger__close_account_action")}
            </Button>
          </SettingsRow>
        </SettingsCard>
      </div>

      {showDeleteModal && event && (
        <DeleteBookModal
          coupleName={coupleNameOf(event)}
          slug={event.slug}
          pending={pending === "deleteBook"}
          onConfirm={handleDeleteBook}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};
