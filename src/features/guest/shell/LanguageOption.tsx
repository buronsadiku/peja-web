"use client";

import { cn } from "@peja/ui/utils/cn";

type LanguageOptionProps = {
  code: string;
  label: string;
  active: boolean;
  onSelect: (code: string) => void;
};

export const LanguageOption = ({
  code,
  label,
  active,
  onSelect,
}: LanguageOptionProps) => {
  const upper = code.toUpperCase();
  return (
    <button
      type="button"
      onClick={() => onSelect(code)}
      className={cn(
        "rounded-10 type-body-small flex items-center gap-2 px-3 py-2 font-semibold transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-foreground hover:bg-muted",
      )}
    >
      <span
        className={cn(
          "rounded-full inline-flex size-6 shrink-0 items-center justify-center type-caption font-bold",
          active
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {upper}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
};
