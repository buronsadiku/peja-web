"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Kicker } from "@peja/ui/components/Kicker";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

type CompletionErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export const CompletionErrorState = ({
  message,
  onRetry,
}: CompletionErrorStateProps) => {
  const t = useTranslations();
  return (
    <div className="bg-background flex min-h-[calc(100vh-89px)] flex-col items-center justify-center text-center">
      <Kicker className="text-destructive">
        {t("signup__completion__error_eyebrow")}
      </Kicker>
      <h1 className="type-h1 mt-3 leading-tight font-semibold tracking-tight">
        {t("signup__completion__error_title")}
      </h1>
      <p
        className="type-body-small text-destructive mt-3 max-w-md"
        role="alert"
      >
        {message}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button onClick={onRetry} className="rounded-full">
          {t("signup__completion__error_retry")}
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href={appRoutes.app.root}>
            {t("signup__completion__error_skip")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
