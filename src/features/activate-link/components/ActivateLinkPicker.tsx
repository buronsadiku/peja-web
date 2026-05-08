"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Kicker } from "@peja/ui/components/Kicker";
import { PlanCard } from "@/features/auth/SignUp/components/PlanCard";
import { paymentsClient } from "@/lib/api/payments-client";
import { ApiError } from "@/lib/api/client";
import { env } from "@/lib/utils/env";
import type { Plan, CheckoutPlanTier } from "@/lib/api/types";

const formatPrice = (cents: number, currency: string) => {
  if (cents === 0) return "Free";
  const symbol = currency === "EUR" ? "€" : currency;
  return `${symbol}${(cents / 100).toFixed(0)}`;
};

const formatPer = (cents: number) =>
  cents === 0 ? "free, forever" : "one-time";

const buildFeatures = (plan: Plan): string[] => {
  const features: string[] = [];
  features.push(
    plan.messageLimit === null
      ? "Unlimited messages"
      : `Up to ${plan.messageLimit} messages`,
  );
  if (plan.storageDays === null) features.push("Lifetime storage");
  else features.push(`${plan.storageDays} days storage`);
  if (plan.creditCents > 0) {
    features.push(`€${(plan.creditCents / 100).toFixed(0)} keepsake credit`);
  }
  features.push("Auto-transcription");
  return features;
};

type ActivateLinkPickerProps = {
  eventId: string;
  plans: Plan[];
};

export const ActivateLinkPicker = ({
  eventId,
  plans,
}: ActivateLinkPickerProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPendingCode(null);
    setError(null);
    const handlePageShow = (event: PageTransitionEvent) => {
      console.log(
        "[ActivateLinkPicker] pageshow fired, persisted:",
        event.persisted,
      );
      setPendingCode(null);
      setError(null);
      if (event.persisted) {
        router.refresh();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  const handleSelectPlan = async (planCode: string) => {
    console.log("[ActivateLinkPicker] selecting plan", planCode);
    setPendingCode(planCode);
    setError(null);
    try {
      const checkout = await paymentsClient.createCheckoutSession({
        eventId,
        orderType: "plan",
        planTier: planCode as CheckoutPlanTier,
        successUrl: `${env.APP_URL}/checkout/{CHECKOUT_SESSION_ID}/success`,
        cancelUrl: `${env.APP_URL}/checkout/{CHECKOUT_SESSION_ID}/cancel`,
      });
      console.log("[ActivateLinkPicker] checkout created", checkout);
      window.location.assign(checkout.checkoutUrl);
    } catch (err) {
      console.error("[ActivateLinkPicker] checkout failed", err);
      setPendingCode(null);
      setError(
        ApiError.isApiError(err)
          ? err.message
          : t("activate_link__error_default"),
      );
    }
  };

  const sorted = [...plans].sort((a, b) => a.sortOrder - b.sortOrder);
  const highlightCode = sorted.find((p) => p.priceCents > 0)?.code;

  return (
    <div className="bg-background min-h-[calc(100vh-89px)]">
      <div className="mx-auto max-w-310 px-6 py-14">
        <div className="mb-10 text-center">
          <Kicker className="text-primary">
            {t("activate_link__eyebrow")}
          </Kicker>
          <h1 className="type-display mt-3.5 leading-tight font-semibold tracking-tight">
            {t("activate_link__title_a")}{" "}
            <span className="text-primary italic">
              {t("activate_link__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-140 leading-relaxed">
            {t("activate_link__subtitle")}
          </p>
        </div>

        <div className="tablet:grid-cols-3 grid gap-4.5">
          {sorted.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={formatPrice(plan.priceCents, plan.currency)}
              per={formatPer(plan.priceCents)}
              description={plan.description ?? ""}
              features={buildFeatures(plan)}
              highlighted={plan.code === highlightCode}
              onSelect={() => {
                console.log("[ActivateLinkPicker] click", plan.code, "pending:", pendingCode);
                handleSelectPlan(plan.code);
              }}
            />
          ))}
        </div>

        {pendingCode && (
          <p className="type-body-small text-muted-foreground mt-6 text-center">
            {t("activate_link__redirecting")}
          </p>
        )}
        {error && (
          <p className="type-body-small text-destructive mt-6 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
