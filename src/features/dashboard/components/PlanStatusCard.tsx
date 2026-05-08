"use client";

import { useTranslations } from "next-intl";
import type { Subscription } from "@/lib/api/types";

const formatCredit = (cents: number) =>
  cents === 0 ? null : `€${(cents / 100).toFixed(0)}`;

const formatDaysLeft = (expiresAt: string | null) => {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  const days = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  return days;
};

type PlanStatusCardProps = {
  subscription: Subscription;
};

export const PlanStatusCard = ({ subscription }: PlanStatusCardProps) => {
  const t = useTranslations();
  const credit = formatCredit(subscription.creditCentsRemaining);
  const daysLeft = formatDaysLeft(subscription.expiresAt);

  return (
    <div className="rounded-16 border-primary/40 bg-primary/10 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border p-5">
      <div className="rounded-12 bg-primary text-primary-foreground type-h3 flex size-12 shrink-0 items-center justify-center font-bold">
        ✦
      </div>
      <div className="flex-1">
        <p className="type-overline text-primary tracking-[2px]">
          {t("plan_status__eyebrow")}
        </p>
        <p className="type-h3 mt-1 font-semibold">
          {subscription.planName}
        </p>
        <div className="type-body-small text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {credit && (
            <span>
              {t("plan_status__credit", { amount: credit })}
            </span>
          )}
          {daysLeft !== null && (
            <span>
              {t("plan_status__days_left", { days: daysLeft })}
            </span>
          )}
          {subscription.expiresAt === null && (
            <span>{t("plan_status__lifetime")}</span>
          )}
        </div>
      </div>
    </div>
  );
};
