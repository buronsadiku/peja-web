"use client";

import { useTranslations } from "next-intl";
import { cn } from "@peja/ui/utils/cn";

type NudgeChannelButtonProps = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count: number;
  recommended: boolean;
};

export const NudgeChannelButton = ({
  label,
  icon: Icon,
  count,
  recommended,
}: NudgeChannelButtonProps) => {
  const t = useTranslations();
  return (
    <button
      type="button"
      className={cn(
        "rounded-16 type-body-small inline-flex cursor-pointer items-center gap-2.5 px-4 py-3 font-semibold",
        recommended
          ? "bg-foreground text-background"
          : "border-border bg-card text-foreground border",
      )}
    >
      <Icon width={15} height={15} />
      <span>{label}</span>
      <span
        className={cn(
          "type-caption font-bold",
          recommended ? "text-background/70" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
      {recommended && (
        <span className="rounded-4 bg-destructive type-overline text-background px-1.5 py-0.5">
          {t("guests__nudge__best")}
        </span>
      )}
    </button>
  );
};
