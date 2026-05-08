"use client";

import { useTranslations } from "next-intl";
import { BookIcon } from "@peja/icons/BookIcon";

export const GuestThankYouCard = () => {
  const t = useTranslations();
  return (
    <div className="rounded-20 from-primary to-primary/80 text-primary-foreground tablet:p-10 relative overflow-hidden bg-gradient-to-br p-8">
      <div className="bg-destructive/30 absolute -right-10 -bottom-10 size-55 rounded-full" />
      <div className="relative">
        <span className="type-overline text-primary-foreground/75">
          {t("guests__thankyou__eyebrow")}
        </span>
        <h3 className="type-h2 mt-2.5 tracking-tight">
          {t("guests__thankyou__title_a", { count: 47 })}
          <br />
          {t("guests__thankyou__title_b")}{" "}
          <span className="italic">{t("guests__thankyou__title_c")}</span>
          {t("guests__thankyou__title_d")}
        </h3>
        <p className="type-body-small mt-2.5 max-w-sm leading-relaxed opacity-90">
          {t("guests__thankyou__body")}
        </p>
        <button
          type="button"
          className="bg-card type-body-small text-primary mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full px-4.5 py-3 font-bold shadow-lg"
        >
          <BookIcon width={14} height={14} />
          {t("guests__thankyou__cta")}
        </button>
        <div className="type-caption mt-4.5 flex items-center gap-2 opacity-75">
          <span className="bg-primary-foreground inline-block size-1.5 rounded-full" />
          {t("guests__thankyou__price", { count: 47 })}
        </div>
      </div>
    </div>
  );
};
