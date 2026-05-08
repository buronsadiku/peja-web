"use client";

import { cn } from "@peja/ui/utils/cn";

type SettingsToggleProps = {
  on: boolean;
  onChange?: (value: boolean) => void;
};

export const SettingsToggle = ({ on, onChange }: SettingsToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => onChange?.(!on)}
    className={cn(
      "relative h-5.5 w-10 shrink-0 cursor-pointer rounded-full transition-colors",
      on
        ? "bg-primary shadow-[0_0_0_4px_var(--primary)/10]"
        : "bg-muted-foreground/30",
    )}
  >
    <div
      className={cn(
        "bg-card absolute top-0.5 size-4.5 rounded-full shadow-sm transition-[left]",
        on ? "left-5" : "left-0.5",
      )}
    />
  </button>
);
