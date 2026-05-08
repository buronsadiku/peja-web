"use client";

import { cn } from "@peja/ui/utils/cn";

type NameOrderOptionProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export const NameOrderOption = ({
  label,
  active = false,
  onClick,
}: NameOrderOptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "type-body-small cursor-pointer rounded-full px-3.5 py-2.5 font-semibold transition-colors",
      active
        ? "bg-primary text-primary-foreground"
        : "border-border bg-card text-foreground hover:bg-muted border",
    )}
  >
    {label}
  </button>
);
