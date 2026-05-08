"use client";

import { useTranslations } from "next-intl";
import { LockIcon } from "@peja/icons/LockIcon";

type PhoneMockupProps = {
  url: string;
  partner1: string;
  partner2: string;
  date?: string;
  venue?: string;
};

export const PhoneMockup = ({
  url,
  partner1,
  partner2,
  date,
  venue,
}: PhoneMockupProps) => {
  const t = useTranslations();
  return (
    <div className="bg-card self-center rounded-[28px] border-[10px] border-black/15 p-3 shadow-lg">
      <div className="rounded-20 bg-background text-foreground flex min-h-70 flex-col gap-2.5 p-4">
        <div className="rounded-8 border-border bg-card type-caption text-muted-foreground flex items-center gap-1.5 border px-2.5 py-1.5 font-mono">
          <LockIcon width={8} height={8} />
          peja.love/{url}
        </div>
        <div className="mt-3.5 text-center">
          <p className="type-overline text-muted-foreground tracking-wider">
            {t("auth__signup__phone__welcome")}
          </p>
          <p className="type-h3 mt-1.5 leading-tight font-semibold">
            {partner1} &amp;{" "}
            <span className="text-primary italic">{partner2}</span>
          </p>
          {(date || venue) && (
            <p className="type-caption text-muted-foreground mt-1">
              {date} {venue && `· ${venue}`}
            </p>
          )}
        </div>
        <div className="rounded-12 bg-primary type-caption text-primary-foreground mt-auto p-2.5 text-center font-semibold">
          {t("auth__signup__phone__cta")}
        </div>
      </div>
    </div>
  );
};
