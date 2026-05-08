"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { PlayIcon } from "@peja/icons/PlayIcon";
import { QrCodeIcon } from "@peja/icons/QrCodeIcon";
import { useRouter } from "@/i18n/navigation";
import { startKioskOnThisDevice } from "../startKioskOnThisDevice";

type KioskStatusCardProps = {
  slug: string | null;
};

export const KioskStatusCard = ({ slug }: KioskStatusCardProps) => {
  const t = useTranslations();
  const router = useRouter();
  return (
    <div className="rounded-20 border-border bg-card w-85 border p-5.5 shadow">
      <div className="type-overline text-muted-foreground flex items-center gap-2.5">
        <span className="bg-muted-foreground/50 size-2 rounded-full" />
        {t("kiosk__hero__status_offline")}
      </div>
      <p className="type-h3 mt-2.5 leading-snug font-semibold tracking-tight">
        {t("kiosk__hero__status_lead")}
      </p>
      {slug ? (
        <Button
          className="rounded-16 mt-4 w-full shadow-lg"
          onClick={() => startKioskOnThisDevice(router, slug)}
        >
          <PlayIcon width={14} height={14} />
          {t("kiosk__hero__start")}
        </Button>
      ) : (
        <Button disabled className="rounded-16 mt-4 w-full shadow-lg">
          <PlayIcon width={14} height={14} />
          {t("kiosk__hero__needs_event")}
        </Button>
      )}
      <div className="rounded-10 bg-background type-caption text-muted-foreground mt-3.5 flex items-center gap-2.5 p-3 leading-relaxed">
        <QrCodeIcon width={20} height={20} className="text-primary shrink-0" />
        {t("kiosk__hero__qr_hint")}
      </div>
    </div>
  );
};
