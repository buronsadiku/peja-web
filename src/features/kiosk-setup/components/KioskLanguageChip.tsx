"use client";

import { useTranslations } from "next-intl";
import { cn } from "@peja/ui/utils/cn";

type KioskLanguageChipProps = {
  flag: string;
  label: string;
  isMain?: boolean;
  onSetMain?: () => void;
  onRemove?: () => void;
};

export const KioskLanguageChip = ({
  flag,
  label,
  isMain,
  onSetMain,
  onRemove,
}: KioskLanguageChipProps) => {
  const t = useTranslations();
  return (
    <span
      className={cn(
        "type-body-small inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-semibold",
        isMain
          ? "bg-primary/10 text-primary"
          : "border-border bg-card text-foreground border",
      )}
    >
      {!isMain && onSetMain ? (
        <button
          type="button"
          onClick={onSetMain}
          className="inline-flex cursor-pointer items-center gap-1.5"
          aria-label="Set as main language"
        >
          <span>{flag}</span>
          {label}
        </button>
      ) : (
        <>
          <span>{flag}</span>
          {label}
        </>
      )}
      {isMain && (
        <span className="rounded-4 bg-primary type-overline text-primary-foreground ml-0.5 px-1.5 py-0.5">
          {t("kiosk__config__languages__main")}
        </span>
      )}
      {!isMain && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-foreground ml-0.5 cursor-pointer transition-colors"
          aria-label="Remove language"
        >
          &times;
        </button>
      )}
    </span>
  );
};
