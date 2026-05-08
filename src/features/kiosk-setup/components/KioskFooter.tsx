"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { PlayIcon } from "@peja/icons/PlayIcon";
import { useRouter } from "@/i18n/navigation";
import { startKioskOnThisDevice } from "../startKioskOnThisDevice";

type KioskFooterProps = {
  slug: string | null;
  isSaving?: boolean;
  saveError?: Error | null;
};

export const KioskFooter = ({ slug, isSaving, saveError }: KioskFooterProps) => {
  const t = useTranslations();
  const router = useRouter();
  return (
    <div className="flex items-center justify-between">
      <span className="type-caption text-muted-foreground">
        {saveError
          ? t("kiosk__footer__save_failed")
          : isSaving
            ? t("kiosk__footer__saving")
            : t("kiosk__footer__autosave")}
      </span>
      <div className="flex gap-2.5">
        {slug ? (
          <Button
            className="rounded-full shadow-lg"
            onClick={() => startKioskOnThisDevice(router, slug)}
          >
            <PlayIcon width={13} height={13} />
            {t("kiosk__footer__start")}
          </Button>
        ) : (
          <Button disabled className="rounded-full shadow-lg">
            <PlayIcon width={13} height={13} />
            {t("kiosk__footer__start")}
          </Button>
        )}
      </div>
    </div>
  );
};
