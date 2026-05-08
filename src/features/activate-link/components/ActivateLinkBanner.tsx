"use client";

import { useTranslations } from "next-intl";
import { ActivateLinkButton } from "./ActivateLinkButton";

export const ActivateLinkBanner = () => {
  const t = useTranslations();
  return (
    <div className="rounded-16 border-primary/40 from-primary/10 to-accent/10 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border bg-gradient-to-br p-5">
      <div className="rounded-12 bg-primary text-primary-foreground type-h3 flex size-12 shrink-0 items-center justify-center font-bold">
        ✦
      </div>
      <div className="flex-1">
        <p className="type-overline text-primary tracking-[2px]">
          {t("activate_link__banner__eyebrow")}
        </p>
        <p className="tablet:type-h2 type-h3 mt-1.5 leading-snug font-semibold tracking-tight">
          {t("activate_link__banner__title")}
        </p>
        <p className="type-body-small text-muted-foreground mt-1.5">
          {t("activate_link__banner__body")}
        </p>
      </div>
      <ActivateLinkButton className="shadow-primary/40 tablet:w-auto w-full shadow-md" />
    </div>
  );
};
