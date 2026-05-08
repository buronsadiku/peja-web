"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { DownloadIcon } from "@peja/icons/DownloadIcon";
import type { EventStats } from "@/lib/api/types";
import { useExportAllMessages } from "../hooks/useExportAllMessages";

type MessageToolbarProps = {
  stats: EventStats | null;
};

export const MessageToolbar = ({ stats }: MessageToolbarProps) => {
  const t = useTranslations();
  const total = stats?.totalMessages ?? 0;
  const { exportAll, isExporting } = useExportAllMessages();

  const buildSubtitle = (): string => {
    if (!stats || stats.totalMessages === 0) {
      return t("messages__toolbar__subtitle_empty");
    }
    const parts: string[] = [];
    if (stats.photoCount > 0) {
      parts.push(
        t("messages__toolbar__subtitle_photos", { count: stats.photoCount }),
      );
    }
    if (stats.favorites > 0) {
      parts.push(
        t("messages__toolbar__subtitle_favourites", {
          count: stats.favorites,
        }),
      );
    }
    if (stats.audioMessages > 0) {
      parts.push(
        t("messages__toolbar__subtitle_audio", { count: stats.audioMessages }),
      );
    }
    return parts.join(" · ") || t("messages__toolbar__subtitle_default");
  };

  return (
    <div className="border-border bg-card tablet:px-7 border-b px-4 py-5">
      <div className="desktop:flex-row desktop:items-end desktop:justify-between flex flex-col gap-4">
        <div>
          <h1 className="desktop:type-h1 type-h2 leading-tight font-semibold tracking-tight">
            <span>{t("messages__toolbar__count", { count: total })}</span>{" "}
            {total > 0 && (
              <span className="text-primary italic">
                {t("messages__toolbar__voices", {
                  count: stats?.audioMessages ?? 0,
                })}
              </span>
            )}
          </h1>
          <p className="type-body-small text-muted-foreground mt-1.5">
            {buildSubtitle()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={total === 0 || isExporting}
            onClick={exportAll}
            className="rounded-10 bg-foreground text-background hover:bg-foreground/90"
          >
            <DownloadIcon width={13} height={13} />{" "}
            {t("messages__toolbar__export_all")}
          </Button>
        </div>
      </div>
    </div>
  );
};
