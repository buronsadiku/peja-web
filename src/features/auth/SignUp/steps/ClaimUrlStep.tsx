"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Kicker } from "@peja/ui/components/Kicker";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { InfoIcon } from "@peja/icons/InfoIcon";
import { SplitLayout } from "../components/SplitLayout";
import { PhoneMockup } from "../components/PhoneMockup";
import { UrlSuggestionChip } from "../components/UrlSuggestionChip";
import { AvailableBadge } from "../components/AvailableBadge";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

const URL_SUGGESTIONS = [
  "lena-and-tomas",
  "serra-navarro",
  "lt2026",
  "book-of-lena",
];

export const ClaimUrlStep = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();
  const slug = formData.bookUrl || "";

  const generateSlug = () => {
    const p1 = formData.partner1Name?.toLowerCase() || "partner1";
    const p2 = formData.partner2Name?.toLowerCase() || "partner2";
    return `${p1}-and-${p2}`;
  };

  const suggestions = formData.partner1Name
    ? [
        generateSlug(),
        `${formData.partner1Name?.[0]?.toLowerCase() ?? ""}${formData.partner2Name?.[0]?.toLowerCase() ?? ""}2026`,
        `book-of-${formData.partner1Name?.toLowerCase() ?? "us"}`,
      ]
    : URL_SUGGESTIONS;

  return (
    <SplitLayout
      left={
        <>
          <Kicker className="relative tracking-[2.5px] opacity-80">
            {t("signup__claim__brand_eyebrow")}
          </Kicker>
          <div className="relative">
            <p className="type-h1 leading-tight tracking-tight italic">
              {t("signup__claim__brand_lead_a")}{" "}
              <span className="text-primary-foreground italic">
                {t("signup__claim__brand_lead_b")}
              </span>
            </p>
          </div>
          <PhoneMockup
            url={slug || generateSlug()}
            partner1={
              formData.partner1Name || t("signup__book_details__partner1")
            }
            partner2={
              formData.partner2Name || t("signup__book_details__partner2")
            }
            date={formData.weddingDate?.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            venue={formData.venue}
          />
        </>
      }
      right={
        <>
          <Kicker className="text-primary mb-3">
            {t("auth__signup__eyebrow_step", {
              step: 5,
              label: t("signup__claim__step_label"),
            })}
          </Kicker>
          <h1 className="type-h1 leading-tight font-semibold tracking-tight">
            {t("signup__claim__title_a")}
            <br />
            <span className="text-primary italic">
              {t("signup__claim__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
            {t("signup__claim__subtitle")}
          </p>

          <div className="mt-6.5">
            <Kicker className="text-muted-foreground mb-2">
              {t("signup__claim__your_link")}
            </Kicker>
            <div className="rounded-16 border-primary bg-card shadow-input flex items-center gap-2 border-2 px-4 py-3.5">
              <span className="type-body-small text-muted-foreground font-mono">
                peja.love /
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  updateFormData({
                    bookUrl: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
                placeholder={generateSlug()}
                className="type-body-small text-foreground placeholder:text-muted-foreground flex-1 bg-transparent font-medium outline-none"
              />
              {slug.length >= 3 && (
                <AvailableBadge label={t("signup__claim__available")} />
              )}
            </div>
            <p className="type-caption text-muted-foreground mt-2">
              {t("signup__claim__hint")}
            </p>
          </div>

          <div className="mt-5.5">
            <Kicker className="text-muted-foreground mb-2.5">
              {t("signup__claim__try_one")}
            </Kicker>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <UrlSuggestionChip
                  key={s}
                  slug={s}
                  onClick={() => updateFormData({ bookUrl: s })}
                />
              ))}
            </div>
          </div>

          <div className="rounded-12 bg-primary/10 mt-8 flex items-start gap-2.5 p-3.5">
            <InfoIcon
              width={18}
              height={18}
              className="text-primary mt-0.5 shrink-0"
              strokeWidth={1.8}
            />
            <p className="type-caption text-muted-foreground leading-relaxed">
              {t.rich("signup__claim__notice", {
                strong: (chunks) => (
                  <strong className="text-foreground">{chunks}</strong>
                ),
                mono: (chunks) => <span className="font-mono">{chunks}</span>,
              })}
            </p>
          </div>

          <Button
            onClick={() => router.push(appRoutes.auth.signUpStep(6))}
            size="lg"
            className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
          >
            {t("signup__claim__continue")}
            <ArrowRightIcon width={16} height={16} />
          </Button>
        </>
      }
    />
  );
};
