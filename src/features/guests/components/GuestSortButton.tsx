"use client";

import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@peja/ui/components/DropdownMenu";
import { SortIcon } from "@peja/icons/SortIcon";
import { CheckIcon } from "@peja/icons/CheckIcon";
import { useGuestSort, useGuestsStore } from "../store/useGuestsStore";
import type { GuestSort } from "../adapters";

const OPTIONS: { value: GuestSort; labelKey: string }[] = [
  { value: "recent", labelKey: "guests__sort__recent" },
  { value: "oldest", labelKey: "guests__sort__oldest" },
  { value: "name_asc", labelKey: "guests__sort__name_asc" },
  { value: "name_desc", labelKey: "guests__sort__name_desc" },
  { value: "most_messages", labelKey: "guests__sort__most_messages" },
];

export const GuestSortButton = () => {
  const t = useTranslations();
  const sort = useGuestSort();
  const setSort = useGuestsStore((s) => s.setSort);

  const activeLabel =
    OPTIONS.find((o) => o.value === sort)?.labelKey ?? OPTIONS[0].labelKey;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="border-border bg-card type-caption text-muted-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 font-semibold transition-colors"
        >
          <SortIcon width={13} height={13} />
          {t(activeLabel)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => setSort(opt.value)}
          >
            <span className="flex-1">{t(opt.labelKey)}</span>
            {sort === opt.value && <CheckIcon width={12} height={12} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
