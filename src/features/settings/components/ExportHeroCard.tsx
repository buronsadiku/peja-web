"use client";

import { useTranslations } from "next-intl";
import { BoxIcon } from "@peja/icons/BoxIcon";

export const ExportHeroCard = () => {
  const t = useTranslations();
  return (
    <div className="rounded-20 from-primary to-primary/80 text-primary-foreground relative mt-8 overflow-hidden bg-gradient-to-br p-8">
      <div className="bg-destructive/30 absolute -top-10 -right-10 size-55 rounded-full" />
      <div className="desktop:grid-cols-[1fr_auto] relative grid items-center gap-10">
        <div>
          <span className="type-overline text-primary-foreground/85">
            {t("settings__data__hero__eyebrow")}
          </span>
          <h3 className="type-h2 mt-2.5 leading-snug font-semibold">
            {t("settings__data__hero__title_a")}
            <br />
            <span className="italic">{t("settings__data__hero__title_b")}</span>
          </h3>
          <p className="type-body-small mt-3 max-w-md leading-relaxed opacity-85">
            {t("settings__data__hero__body")}
          </p>
        </div>
        <button
          type="button"
          className="bg-card type-body-small text-primary inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 font-bold shadow-lg"
        >
          <BoxIcon width={16} height={16} />
          {t("settings__data__hero__cta")}
        </button>
      </div>
    </div>
  );
};
