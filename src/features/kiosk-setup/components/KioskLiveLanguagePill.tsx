"use client";

import { cn } from "@peja/ui/utils/cn";

type KioskLiveLanguagePillProps = {
  flag: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export const KioskLiveLanguagePill = ({
  flag,
  label,
  active,
  onClick,
}: KioskLiveLanguagePillProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "type-body-small inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 font-semibold transition-colors",
      active
        ? "border-primary/30 bg-card border shadow-sm"
        : "bg-card/55 hover:bg-card/85",
    )}
  >
    <span className="type-body-small">{flag}</span>
    {label}
  </button>
);
