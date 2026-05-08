"use client";

import type { ReactNode } from "react";
import { Chip } from "@peja/ui/components/Chip";
import { cn } from "@peja/ui/utils/cn";

export type FilterChipItem = {
  label: string;
  count?: number;
};

type FilterChipRailProps = {
  chips: FilterChipItem[];
  activeLabel: string;
  onSelect: (label: string) => void;
  className?: string;
  leading?: ReactNode;
};

export const FilterChipRail = ({
  chips,
  activeLabel,
  onSelect,
  className,
  leading,
}: FilterChipRailProps) => (
  <div
    className={cn(
      "border-border bg-card flex min-h-fit items-center gap-2 overflow-auto border-b px-4 py-3",
      className,
    )}
  >
    {leading}
    {chips.map((chip) => (
      <Chip
        key={chip.label}
        label={chip.label}
        count={chip.count}
        active={activeLabel === chip.label}
        onClick={() => onSelect(chip.label)}
      />
    ))}
  </div>
);
