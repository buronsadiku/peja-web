"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@peja/ui/components/Chip";
import type { GuestFilter, GuestRow } from "../adapters";

type GuestFilterChipsProps = {
  guests: GuestRow[];
  active: GuestFilter;
  onSelect: (filter: GuestFilter) => void;
};

const FILTERS: { value: GuestFilter; labelKey: string }[] = [
  { value: "all", labelKey: "guests__chips__all" },
  { value: "favorites", labelKey: "guests__chips__favourited" },
  { value: "with_photo", labelKey: "guests__chips__with_photo" },
  { value: "with_audio", labelKey: "guests__chips__with_audio" },
  { value: "with_video", labelKey: "guests__chips__with_video" },
];

const countFor = (guests: GuestRow[], filter: GuestFilter): number => {
  switch (filter) {
    case "favorites":
      return guests.filter((g) => g.isFavorite).length;
    case "with_photo":
      return guests.filter((g) => g.hasPhoto).length;
    case "with_audio":
      return guests.filter((g) => g.hasAudio).length;
    case "with_video":
      return guests.filter((g) => g.hasVideo).length;
    default:
      return guests.length;
  }
};

export const GuestFilterChips = ({
  guests,
  active,
  onSelect,
}: GuestFilterChipsProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((f) => (
        <Chip
          key={f.value}
          label={t(f.labelKey)}
          count={countFor(guests, f.value)}
          active={active === f.value}
          onClick={() => onSelect(f.value)}
        />
      ))}
    </div>
  );
};
