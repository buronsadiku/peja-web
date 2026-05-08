"use client";

import { useState } from "react";
import { cn } from "@peja/ui/utils/cn";

type KioskToggleProps = {
  on?: boolean;
  defaultOn?: boolean;
  onChange?: (value: boolean) => void;
};

export const KioskToggle = ({ on, defaultOn, onChange }: KioskToggleProps) => {
  const isControlled = on !== undefined && onChange !== undefined;
  const [internal, setInternal] = useState<boolean>(defaultOn ?? on ?? false);
  const value = isControlled ? (on as boolean) : internal;

  const handleClick = () => {
    const next = !value;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={handleClick}
      className={cn(
        "relative h-5.5 w-10 shrink-0 cursor-pointer rounded-full transition-colors",
        value ? "bg-primary" : "bg-muted-foreground/30",
      )}
    >
      <div
        className={cn(
          "bg-card absolute top-0.5 size-4.5 rounded-full shadow-sm transition-[left]",
          value ? "left-5" : "left-0.5",
        )}
      />
    </button>
  );
};
