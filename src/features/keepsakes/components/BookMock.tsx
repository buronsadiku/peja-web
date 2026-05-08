"use client";

import { useTranslations } from "next-intl";

export const BookMock = () => {
  const t = useTranslations();
  return (
    <div
      className="rounded-6 bg-card desktop:block hidden p-5 shadow-lg"
      style={{ transform: "perspective(900px) rotateY(-10deg) rotateX(2deg)" }}
    >
      <p className="type-overline text-muted-foreground font-serif tracking-[3px]">
        {t("keepsakes__featured__book_chapter")}
      </p>
      <p className="type-body-large text-foreground mt-2.5 font-serif leading-snug font-semibold italic">
        {t("keepsakes__featured__book_quote")}
      </p>
    </div>
  );
};
