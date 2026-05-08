"use client";

import { useTranslations } from "next-intl";

export const KeepsakesFooter = () => {
  const t = useTranslations();
  return (
    <p className="type-caption text-muted-foreground mt-6 text-center">
      {t("keepsakes__footer__legal")}
    </p>
  );
};
