"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Kicker } from "@peja/ui/components/Kicker";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { LinkIcon } from "@peja/icons/LinkIcon";
import { eventsClient } from "@/lib/api/events-client";
import { paymentsClient } from "@/lib/api/payments-client";
import { ApiError } from "@/lib/api/client";
import { env } from "@/lib/utils/env";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import type { CheckoutPlanTier, CoverPhotoContentType } from "@/lib/api/types";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { NextStepCard } from "../components/NextStepCard";
import { ConfettiDot } from "../components/ConfettiDot";
import { useSignUpStore } from "../useSignUpStore";
import { CompletionCreatingState } from "../components/CompletionCreatingState";
import { CompletionRedirectingState } from "../components/CompletionRedirectingState";
import { CompletionErrorState } from "../components/CompletionErrorState";
import { CompletionSuccessIcon } from "../components/CompletionSuccessIcon";

const CONFETTI = [
  {
    top: 160,
    left: 220,
    color: "oklch(0.723 0.135 40)",
    size: 8,
    rotation: 20,
  },
  {
    top: 240,
    left: 380,
    color: "oklch(0.705 0.120 262.5)",
    size: 6,
    rotation: -15,
  },
  {
    top: 180,
    right: 260,
    color: "oklch(0.833 0.132 151.8)",
    size: 10,
    rotation: 10,
  },
  {
    top: 300,
    right: 420,
    color: "oklch(0.818 0.105 73.3)",
    size: 7,
    rotation: 30,
  },
  {
    top: 520,
    left: 180,
    color: "oklch(0.723 0.135 40)",
    size: 6,
    rotation: 45,
  },
  {
    top: 600,
    right: 300,
    color: "oklch(0.705 0.120 262.5)",
    size: 8,
    rotation: -10,
  },
  {
    top: 700,
    right: 360,
    color: "oklch(0.833 0.132 151.8)",
    size: 7,
    rotation: 25,
  },
  {
    top: 430,
    left: 100,
    color: "oklch(0.705 0.120 262.5)",
    size: 5,
    rotation: 0,
  },
];

const toIsoDate = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

type CreationState =
  | { kind: "creating" }
  | { kind: "redirecting" }
  | { kind: "ready"; slug: string }
  | { kind: "error"; message: string };

const PLAN_TIER_BY_ID: Record<string, CheckoutPlanTier | null> = {
  essential: null,
  keepsake: "premium",
  gold: "bundle",
};

const ALLOWED_COVER_MIMES: Record<string, CoverPhotoContentType> = {
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/heic": "image/heic",
};

const uploadCoverPhoto = async (
  eventId: string,
  file: File,
): Promise<string | null> => {
  const contentType = ALLOWED_COVER_MIMES[file.type];
  if (!contentType) return null;
  const result = await eventsClient.coverUploadUrl(eventId, contentType);
  await uploadToTarget(
    {
      url: result.uploadUrl,
      key: result.key,
    },
    file,
  );
  return result.publicUrl;
};

export const CompletionStep = () => {
  const t = useTranslations();
  const formData = useSignUpStore((s) => s.formData);
  const updateFormData = useSignUpStore((s) => s.updateFormData);
  const [state, setState] = useState<CreationState>({ kind: "creating" });
  const [retryToken, setRetryToken] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const partnerA =
        formData.partner1Name?.trim() || t("signup__partner_a_default");
      const partnerB =
        formData.partner2Name?.trim() || t("signup__partner_b_default");

      try {
        const created = await eventsClient.create({
          partnerAName: partnerA,
          partnerBName: partnerB,
          weddingDate: toIsoDate(formData.weddingDate),
          venueName: formData.venue?.trim() || undefined,
        });
        if (cancelled) return;

        let finalSlug = created.event.slug;
        const desiredSlug = formData.bookUrl?.trim();
        if (
          desiredSlug &&
          desiredSlug !== finalSlug &&
          /^[a-z0-9-]{4,20}$/.test(desiredSlug)
        ) {
          try {
            const updated = await eventsClient.update(created.event.id, {
              slug: desiredSlug,
            });
            finalSlug = updated.event.slug;
          } catch {
            // Slug clash — keep auto-generated
          }
        }

        if (cancelled) return;
        updateFormData({ bookUrl: finalSlug });

        if (formData.coverFile) {
          try {
            const publicUrl = await uploadCoverPhoto(
              created.event.id,
              formData.coverFile,
            );
            if (publicUrl) {
              await eventsClient
                .update(created.event.id, { couplePhotoUrl: publicUrl })
                .catch(() => undefined);
            }
          } catch {
            // Non-fatal — book is created; user can add cover later
          }
          if (cancelled) return;
        }

        const planTier = PLAN_TIER_BY_ID[formData.selectedPlan ?? ""] ?? null;
        if (planTier) {
          setState({ kind: "redirecting" });
          try {
            const checkout = await paymentsClient.createCheckoutSession({
              eventId: created.event.id,
              orderType: "plan",
              planTier,
              successUrl: `${env.APP_URL}/checkout/{CHECKOUT_SESSION_ID}/success`,
              cancelUrl: `${env.APP_URL}/checkout/{CHECKOUT_SESSION_ID}/cancel`,
            });
            if (cancelled) return;
            window.location.assign(checkout.checkoutUrl);
            return;
          } catch (error) {
            if (cancelled) return;
            setState({
              kind: "error",
              message: ApiError.isApiError(error)
                ? `${error.message}`
                : t("signup__completion__error_checkout_default"),
            });
            return;
          }
        }

        setState({ kind: "ready", slug: finalSlug });
      } catch (error) {
        if (cancelled) return;
        setState({
          kind: "error",
          message: ApiError.isApiError(error)
            ? error.message
            : t("signup__completion__error_create_default"),
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    retryToken,
    formData.partner1Name,
    formData.partner2Name,
    formData.weddingDate,
    formData.venue,
    formData.bookUrl,
    formData.selectedPlan,
    formData.coverFile,
    updateFormData,
    t,
  ]);

  if (state.kind === "creating") {
    return <CompletionCreatingState />;
  }

  if (state.kind === "redirecting") {
    return <CompletionRedirectingState />;
  }

  if (state.kind === "error") {
    return (
      <CompletionErrorState
        message={state.message}
        onRetry={() => {
          setState({ kind: "creating" });
          setRetryToken((n) => n + 1);
        }}
      />
    );
  }

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(`peja.love/${state.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-89px)] bg-[radial-gradient(900px_500px_at_50%_20%,oklch(0.705_0.120_262.5/0.18),transparent_60%),radial-gradient(700px_500px_at_10%_90%,oklch(0.833_0.132_151.8/0.10),transparent_60%),radial-gradient(700px_500px_at_90%_80%,oklch(0.723_0.135_40/0.10),transparent_60%)]">
      {CONFETTI.map((dot, i) => (
        <ConfettiDot key={i} {...dot} />
      ))}

      <div className="tablet:px-20 flex min-h-[calc(100vh-89px)] items-center justify-center px-6">
        <div className="relative max-w-185 text-center">
          <CompletionSuccessIcon />

          <Kicker className="text-primary">
            {t("signup__completion__success_step")}
          </Kicker>
          <h1 className="tablet:type-display type-display mt-4.5 leading-none font-semibold tracking-tight">
            {t("signup__completion__success_title_a")}
            <br />
            <span className="text-primary italic">
              {t("signup__completion__success_title_b")}
            </span>
          </h1>
          <p className="type-body-large text-muted-foreground mx-auto mt-5 max-w-135 leading-relaxed">
            {t.rich("signup__completion__success_body", {
              slug: state.slug,
              strong: (chunks) => (
                <strong className="text-foreground">{chunks}</strong>
              ),
            })}
          </p>

          <div className="rounded-16 border-border bg-card mx-auto mt-9 flex max-w-120 items-center gap-3 border px-4.5 py-3.5 shadow-sm">
            <LinkIcon
              width={16}
              height={16}
              className="text-muted-foreground"
            />
            <span className="type-body-small text-foreground flex-1 text-left font-mono">
              peja.love/{state.slug}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="border-border bg-card type-caption text-foreground hover:bg-muted cursor-pointer rounded-full border px-3.5 py-2 font-semibold transition-colors"
            >
              {copied
                ? t("signup__completion__copied")
                : t("signup__completion__copy")}
            </button>
          </div>

          <div className="tablet:grid-cols-3 mt-9 grid gap-3.5 text-left">
            <NextStepCard
              emoji="\uD83D\uDCEC"
              title={t("signup__completion__next_share_title")}
              description={t("signup__completion__next_share_body")}
            />
            <NextStepCard
              emoji="\u2709\uFE0F"
              title={t("signup__completion__next_dashboard_title")}
              description={t("signup__completion__next_dashboard_body")}
            />
            <NextStepCard
              emoji="\uD83C\uDFA8"
              title={t("signup__completion__next_customize_title")}
              description={t("signup__completion__next_customize_body")}
            />
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="shadow-primary/40 rounded-full shadow-md"
            >
              <Link href={appRoutes.app.root}>
                {t("signup__completion__open_dashboard")}
                <ArrowRightIcon width={15} height={15} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href={appRoutes.guest.base(state.slug)}>
                {t("signup__completion__preview_guest")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
