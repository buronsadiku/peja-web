"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Avatar, AvatarFallback } from "@peja/ui/components/Avatar";
import { PlayIcon } from "@peja/icons/PlayIcon";

export const ResumeCard = () => {
  const t = useTranslations();
  const name = t("dashboard__resume__name");
  const role = t("dashboard__resume__role");
  const pausedAt = "1:14";
  const duration = "2:22";
  const initials = "M";
  const tint = "#EFC9A8";

  const onResume = () => {};

  return (
    <div className="rounded-20 border-border bg-card tablet:flex-row tablet:items-center tablet:gap-6 tablet:p-7 flex flex-col gap-4 border p-5 shadow-sm">
      <Avatar size="lg" className="-rotate-3">
        <AvatarFallback
          className="type-body-small text-primary-foreground font-semibold"
          style={{ background: tint }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="type-body-small text-muted-foreground">
          {t("dashboard__resume__pick_up")}
        </p>
        <p className="type-h3 mt-1 leading-snug font-semibold">
          {name} &middot; {role}
        </p>
        <p className="type-body-small text-muted-foreground mt-1 italic">
          {t("dashboard__resume__paused_at", {
            paused: pausedAt,
            total: duration,
          })}
        </p>
      </div>
      <Button
        onClick={onResume}
        size="lg"
        className="shadow-primary/40 tablet:w-auto w-full gap-2.5 rounded-full shadow-md"
      >
        <PlayIcon width={16} height={16} />
        {t("dashboard__resume__continue")}
      </Button>
    </div>
  );
};
