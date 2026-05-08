"use client";

import { useTranslations } from "next-intl";
import type { Subscription } from "@/lib/api/types";

type KeepsakesActionsProps = {
  subscription: Subscription | null;
};

const formatCredit = (cents: number) =>
  cents > 0 ? `€${(cents / 100).toFixed(0)}` : null;

export const KeepsakesActions = ({ subscription }: KeepsakesActionsProps) => {
  const t = useTranslations();
  const credit = subscription
    ? formatCredit(subscription.creditCentsRemaining)
    : null;

  return (
    <div className="flex items-center gap-3">
      {credit && (
        <span className="type-caption text-accent-foreground font-semibold">
          {t("sidebar__credit_available", { amount: credit })}
        </span>
      )}
      <button
        type="button"
        className="border-border bg-card type-caption text-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 font-semibold transition-colors"
      >
        {t("sidebar__cart", { count: 0 })}
      </button>
    </div>
  );
};
