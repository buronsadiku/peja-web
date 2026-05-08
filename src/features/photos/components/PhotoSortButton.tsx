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
import {
  usePhotoSort,
  usePhotosStore,
  type PhotoSort,
} from "../store/usePhotosStore";

const OPTIONS: { value: PhotoSort; labelKey: string }[] = [
  { value: "newest", labelKey: "photos__sort__newest" },
  { value: "oldest", labelKey: "photos__sort__oldest" },
];

export const PhotoSortButton = () => {
  const t = useTranslations();
  const sort = usePhotoSort();
  const setSort = usePhotosStore((s) => s.setSort);

  const activeLabel =
    OPTIONS.find((o) => o.value === sort)?.labelKey ?? OPTIONS[0].labelKey;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-10 border-border bg-card type-body-small text-muted-foreground hover:bg-muted desktop:inline-flex hidden cursor-pointer items-center gap-1.5 border px-3.5 py-2.5 font-medium transition-colors"
        >
          <SortIcon width={13} height={13} strokeWidth={1.7} />
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
