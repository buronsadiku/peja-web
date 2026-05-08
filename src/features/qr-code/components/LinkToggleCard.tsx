"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { eventsClient } from "@/lib/api/events-client";
import { ApiError } from "@/lib/api/client";
import { useRouter } from "@/i18n/navigation";

type LinkToggleCardProps = {
  eventId: string;
  enabled: boolean;
};

export const LinkToggleCard = ({ eventId, enabled }: LinkToggleCardProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    setError(null);
    startTransition(async () => {
      try {
        await eventsClient.update(eventId, { submissionsEnabled: !enabled });
        router.refresh();
      } catch (err) {
        setError(
          ApiError.isApiError(err)
            ? err.message
            : t("link_toggle__error_default"),
        );
      }
    });
  };

  return (
    <div className="rounded-16 border-border bg-card tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border p-5">
      <div className="flex-1">
        <p className="type-overline text-muted-foreground tracking-[2px]">
          {enabled ? t("link_toggle__active") : t("link_toggle__paused")}
        </p>
        <p className="tablet:type-h2 type-h3 mt-1.5 leading-snug font-semibold tracking-tight">
          {enabled ? t("link_toggle__title_on") : t("link_toggle__title_off")}
        </p>
        <p className="type-body-small text-muted-foreground mt-1.5">
          {enabled ? t("link_toggle__body_on") : t("link_toggle__body_off")}
        </p>
        {error && (
          <p className="type-caption text-destructive mt-2">{error}</p>
        )}
      </div>
      <Button
        type="button"
        variant={enabled ? "outline" : "default"}
        onClick={handleToggle}
        disabled={pending}
        className="tablet:w-auto w-full rounded-full"
      >
        {pending
          ? t("link_toggle__working")
          : enabled
            ? t("link_toggle__deactivate")
            : t("link_toggle__activate")}
      </Button>
    </div>
  );
};
