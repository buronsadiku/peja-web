"use client";

import { forwardRef } from "react";
import { cn } from "../utils/cn";

type ChipProps = Omit<React.ComponentProps<"button">, "children"> & {
  label: string;
  count?: number;
  active?: boolean;
  onRemove?: () => void;
};

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ label, count, active = false, onRemove, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "type-caption inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold whitespace-nowrap transition-colors",
        active
          ? "bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:bg-muted border",
        className,
      )}
      {...props}
    >
      {label}
      {count != null && <span>&middot; {count}</span>}
      {onRemove && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      )}
    </button>
  ),
);
Chip.displayName = "Chip";
