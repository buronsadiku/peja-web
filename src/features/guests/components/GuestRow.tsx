"use client";

import { useLocale, useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@peja/ui/components/Avatar";
import { Checkbox } from "@peja/ui/components/Checkbox";
import { HeartIcon } from "@peja/icons/HeartIcon";
import { ImageIcon } from "@peja/icons/ImageIcon";
import { MicIcon } from "@peja/icons/MicIcon";
import { VideoIcon } from "@peja/icons/VideoIcon";
import type { GuestRow as GuestRowData } from "../adapters";
import { GuestStatusPill } from "./GuestStatusPill";

type GuestRowProps = {
  guest: GuestRowData;
  selected: boolean;
  onToggleSelect: () => void;
  isLast: boolean;
};

export const GuestRow = ({
  guest,
  selected,
  onToggleSelect,
  isLast,
}: GuestRowProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const lastDate = new Date(guest.lastAt);
  const lastLabel = lastDate.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`grid grid-cols-[28px_minmax(220px,1.4fr)_120px_140px_180px_36px] items-center gap-3.5 px-6 py-3.5 ${
        isLast ? "" : "border-border border-b"
      }`}
    >
      <Checkbox
        checked={selected}
        onChange={onToggleSelect}
        aria-label={t("guests__row__select_aria", { name: guest.name })}
      />
      <div className="flex min-w-0 items-center gap-3">
        <Avatar size="default">
          <AvatarFallback
            className="type-body-small text-primary-foreground font-semibold"
            style={{ background: guest.tint }}
          >
            {guest.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="type-body-small truncate font-semibold">
              {guest.name}
            </span>
            {guest.isFavorite && (
              <HeartIcon
                width={12}
                height={12}
                fill="var(--destructive)"
                stroke="none"
              />
            )}
          </div>
          <div className="type-caption text-muted-foreground">
            {t("guests__row__contributions", { count: guest.messageCount })}
          </div>
        </div>
      </div>
      <div className="type-caption text-muted-foreground flex items-center gap-2">
        <span className="text-foreground font-semibold">
          {guest.messageCount}
        </span>
        {guest.audioCount > 0 && (
          <MicIcon width={12} height={12} className="text-muted-foreground" />
        )}
        {guest.photoCount > 0 && (
          <ImageIcon
            width={12}
            height={12}
            className="text-muted-foreground"
          />
        )}
        {guest.videoCount > 0 && (
          <VideoIcon width={12} height={12} className="text-muted-foreground" />
        )}
      </div>
      <GuestStatusPill
        contributed={guest.messageCount > 0}
        thanked={false}
      />
      <div className="type-caption text-muted-foreground">{lastLabel}</div>
      <span aria-hidden />
    </div>
  );
};
