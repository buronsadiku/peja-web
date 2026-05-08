"use client";

import { useTranslations } from "next-intl";
import { ChevronLeftIcon } from "@peja/icons/ChevronLeftIcon";
import { Link } from "@/i18n/navigation";

type WizardHeaderProps = {
  backHref: string;
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
};

const padIndex = (n: number) => String(n).padStart(2, "0");

export const WizardHeader = ({
  backHref,
  step,
  totalSteps,
  title,
  subtitle,
}: WizardHeaderProps) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <Link
          href={backHref}
          className="bg-card/85 border-border rounded-full text-foreground inline-flex items-center gap-1.5 border px-3 py-2 backdrop-blur-sm shadow-sm"
        >
          <ChevronLeftIcon width={14} height={14} />
          <span className="type-body-small font-semibold">
            {t("guest__wizard__back")}
          </span>
        </Link>
        <span className="type-caption text-muted-foreground font-mono">
          {t("guest__wizard__step_of", {
            current: padIndex(step),
            total: padIndex(totalSteps),
          })}
        </span>
      </div>
      <div>
        <h2 className="type-h2 font-semibold leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="type-body-small text-muted-foreground mt-1.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
