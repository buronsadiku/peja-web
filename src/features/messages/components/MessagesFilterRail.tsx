"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@peja/ui/components/Checkbox";
import {
  FilterChipRail,
  type FilterChipItem,
} from "@/components/FilterChipRail";
import type { EventStats, MessageFilter } from "@/lib/api/types";
import {
  useFilter,
  useMessagesStore,
  useSelectedIds,
} from "../store/useMessagesStore";
import { useMessageList } from "../hooks/useMessageList";

type MessagesFilterRailProps = {
  stats: EventStats | null;
};

const FILTER_VALUES: { labelKey: string; value: MessageFilter }[] = [
  { labelKey: "messages__filter__all", value: "all" },
  { labelKey: "messages__filter__favourites", value: "favorites" },
  { labelKey: "messages__filter__with_photo", value: "with_photo" },
  { labelKey: "messages__filter__with_video", value: "with_video" },
  { labelKey: "messages__filter__audio_only", value: "audio_only" },
];

export const MessagesFilterRail = ({ stats }: MessagesFilterRailProps) => {
  const t = useTranslations();
  const filter = useFilter();
  const setFilter = useMessagesStore((s) => s.setFilter);
  const selectAll = useMessagesStore((s) => s.selectAll);
  const clearSelection = useMessagesStore((s) => s.clearSelection);
  const selectedIds = useSelectedIds();
  const { messageViews } = useMessageList();

  const filterChips = FILTER_VALUES.map((c) => ({
    label: t(c.labelKey),
    value: c.value,
  }));

  const countForChip = (value: MessageFilter): number | undefined => {
    if (!stats) return undefined;
    switch (value) {
      case "all":
        return stats.totalMessages;
      case "favorites":
        return stats.favorites;
      case "with_photo":
        return stats.photoCount;
      case "with_video":
        return stats.videoCount;
      case "audio_only":
        return stats.audioMessages;
      default:
        return undefined;
    }
  };

  const chipItems: FilterChipItem[] = filterChips.map((c) => ({
    label: c.label,
    count: countForChip(c.value),
  }));

  const activeChipLabel =
    filterChips.find((c) => c.value === filter)?.label ?? filterChips[0].label;

  const handleChipSelect = (label: string) => {
    const next = filterChips.find((c) => c.label === label);
    if (next) setFilter(next.value);
  };

  const allSelected =
    messageViews.length > 0 && messageViews.every((m) => selectedIds.has(m.id));

  const handleToggleAll = () => {
    if (allSelected) clearSelection();
    else selectAll(messageViews.map((m) => m.id));
  };

  return (
    <FilterChipRail
      chips={chipItems}
      activeLabel={activeChipLabel}
      onSelect={handleChipSelect}
      leading={
        <Checkbox
          checked={allSelected}
          onChange={handleToggleAll}
          aria-label={t("messages__select_all")}
          className="mr-1 ml-2.5"
        />
      }
    />
  );
};
