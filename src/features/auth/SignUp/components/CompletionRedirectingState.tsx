"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";

export const CompletionRedirectingState = () => {
  const t = useTranslations();
  return (
    <div className="bg-background flex min-h-[calc(100vh-89px)] flex-col items-center justify-center text-center">
      <div className="bg-primary/15 mb-7 inline-flex size-20 items-center justify-center rounded-full">
        <span className="border-primary size-8 animate-spin rounded-full border-3 border-t-transparent" />
      </div>
      <Kicker className="text-muted-foreground">
        {t("signup__completion__redirecting_eyebrow")}
      </Kicker>
      <h1 className="type-h1 mt-3 leading-tight font-semibold tracking-tight">
        {t("signup__completion__redirecting_title")}
      </h1>
      <p className="type-body-small text-muted-foreground mt-3 max-w-md">
        {t("signup__completion__redirecting_body")}
      </p>
    </div>
  );
};
