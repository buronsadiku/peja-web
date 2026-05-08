"use client";

import { cn } from "@peja/ui/utils/cn";

type GuestPageButtonProps = {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const GuestPageButton = ({
  label,
  active,
  disabled,
  onClick,
}: GuestPageButtonProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "rounded-8 type-caption flex size-7.5 items-center justify-center font-semibold",
      disabled
        ? "text-muted-foreground cursor-default"
        : "cursor-pointer",
      active
        ? "bg-foreground text-background"
        : "border-border bg-card text-foreground border",
    )}
  >
    {label}
  </button>
);
