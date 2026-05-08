"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { Sparkline } from "@peja/illustrations/Sparkline";
import { QRStat } from "./QRStat";

type QRStatsCardProps = {
  totalMessages: number;
  photoCount: number;
  videoCount: number;
  audioMessages: number;
};

export const QRStatsCard = ({
  totalMessages,
  photoCount,
  videoCount,
  audioMessages,
}: QRStatsCardProps) => {
  const t = useTranslations();
  const stats = [
    {
      value: String(totalMessages),
      label: t("qr_code__stats__messages_recorded"),
    },
    { value: String(photoCount), label: t("qr_code__stats__photos") },
    { value: String(videoCount), label: t("qr_code__stats__videos") },
    { value: String(audioMessages), label: t("qr_code__stats__audio") },
  ];
  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Kicker className="text-muted-foreground">
        {t("qr_code__stats__eyebrow")}
      </Kicker>
      <div className="mt-3.5 grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <QRStat key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-3.5">
        <Sparkline />
        <div className="type-caption text-muted-foreground mt-1.5 flex justify-between">
          <span>{t("qr_code__stats__30_days_ago")}</span>
          <span>{t("qr_code__stats__today")}</span>
        </div>
      </div>
    </div>
  );
};
