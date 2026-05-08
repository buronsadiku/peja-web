"use client";

import { useTranslations } from "next-intl";

export const MostChosenBadge = () => {
  const t = useTranslations();
  return (
    <div className="bg-destructive type-caption text-primary-foreground shadow-destructive/40 absolute -top-3 left-6 rounded-full px-3 py-1.5 font-bold tracking-wider shadow-md">
      {t("common__most_chosen")}
    </div>
  );
};
