"use client";

import { useTranslations } from "next-intl";
import { ActivateLinkButton } from "@/features/activate-link";

export const NudgeCard = () => {
  const t = useTranslations();
  return (
    <div className="rounded-16 border-primary/40 bg-primary/10 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border p-5">
      <div className="rounded-12 bg-primary text-primary-foreground type-h3 flex size-12 shrink-0 items-center justify-center font-bold">
        ✦
      </div>
      <div className="flex-1">
        <p className="type-body-large font-serif font-semibold">
          {t("dashboard__nudge__activate_title")}
        </p>
        <p className="type-body-small text-muted-foreground">
          {t("dashboard__nudge__activate_description")}
        </p>
      </div>
      <ActivateLinkButton
        variant="outline"
        className="tablet:w-auto w-full bg-transparent"
      />
    </div>
  );
};
