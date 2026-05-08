"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Input } from "@peja/ui/components/Input";
import { Label } from "@peja/ui/components/Label";
import { Kicker } from "@peja/ui/components/Kicker";
import { Calendar } from "@peja/ui/components/DatePicker";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { CalendarIcon } from "@peja/icons/CalendarIcon";
import { SplitLayout } from "../components/SplitLayout";
import { BookPreview } from "../components/BookPreview";
import { NameOrderOption } from "../components/NameOrderOption";
import { CountdownCard } from "../components/CountdownCard";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const BookDetailsStep = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();
  const { partner1Name, partner2Name, displayOrder, weddingDate, venue } =
    formData;
  const [showCalendar, setShowCalendar] = useState(false);

  const orderOptions = [
    `${partner1Name || t("signup__book_details__partner1")} & ${partner2Name || t("signup__book_details__partner2")}`,
    `${partner2Name || t("signup__book_details__partner2")} & ${partner1Name || t("signup__book_details__partner1")}`,
    t("signup__book_details__display_custom"),
  ];

  const NAME_MAX_LENGTH = 24;

  const blobScale = useMemo(() => {
    const totalChars =
      (partner1Name?.length ?? 0) + (partner2Name?.length ?? 0);
    return 0.6 + Math.min(totalChars / 20, 1) * 0.8;
  }, [partner1Name, partner2Name]);

  const daysUntil = weddingDate
    ? Math.max(
        0,
        Math.ceil((weddingDate.getTime() - new Date().getTime()) / 86400000),
      )
    : 0;

  const handleContinue = () => {
    router.push(appRoutes.auth.signUpStep(4));
  };

  return (
    <SplitLayout
      blobScale={blobScale}
      left={
        <>
          <Kicker className="relative tracking-[2.5px] opacity-80">
            {t("signup__book_details__brand_eyebrow")}
          </Kicker>
          <div className="relative">
            <BookPreview
              partner1={partner1Name}
              partner2={partner2Name}
              date={weddingDate?.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              venue={venue}
            />
            <p className="type-body-small mt-6 leading-relaxed opacity-80">
              {t("signup__book_details__brand_caption")}
            </p>
          </div>
          {daysUntil > 0 && <CountdownCard days={daysUntil} />}
        </>
      }
      right={
        <>
          <Kicker className="text-primary mb-3">
            {t("auth__signup__eyebrow_step", {
              step: 3,
              label: t("signup__book_details__step_label"),
            })}
          </Kicker>
          <h1 className="type-h1 leading-tight font-semibold tracking-tight">
            {t("signup__book_details__title_a")}
            <br />
            <span className="text-primary italic">
              {t("signup__book_details__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
            {t("signup__book_details__subtitle")}
          </p>

          <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-end gap-3.5">
            <div>
              <Label htmlFor="partner1" className="mb-2">
                {t("signup__book_details__partner1")}
              </Label>
              <Input
                id="partner1"
                value={partner1Name}
                maxLength={NAME_MAX_LENGTH}
                onChange={(e) =>
                  updateFormData({ partner1Name: e.target.value })
                }
                placeholder={t("signup__book_details__name_placeholder")}
              />
            </div>
            <span className="text-muted-foreground type-h1 pb-2.5 italic">
              &amp;
            </span>
            <div>
              <Label htmlFor="partner2" className="mb-2">
                {t("signup__book_details__partner2")}
              </Label>
              <Input
                id="partner2"
                value={partner2Name}
                maxLength={NAME_MAX_LENGTH}
                onChange={(e) =>
                  updateFormData({ partner2Name: e.target.value })
                }
                placeholder={t("signup__book_details__name_placeholder")}
              />
            </div>
          </div>

          <div className="mt-5">
            <Label className="mb-2">
              {t("signup__book_details__display_label")}
            </Label>
            <div className="flex flex-wrap gap-2">
              {orderOptions.map((option) => (
                <NameOrderOption
                  key={option}
                  label={option}
                  active={displayOrder === option}
                  onClick={() => updateFormData({ displayOrder: option })}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Label className="mb-2">
              {t("signup__book_details__date_label")}
            </Label>
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="group rounded-12 border-border bg-card hover:border-primary/40 hover:shadow-input flex w-full cursor-pointer items-center justify-between border px-4 py-3 shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-8 bg-primary/10 text-primary group-hover:bg-primary/15 flex size-9 items-center justify-center transition-colors">
                  <CalendarIcon width={16} height={16} />
                </span>
                <span
                  className={
                    weddingDate
                      ? "type-body-small text-foreground font-medium"
                      : "type-body-small text-muted-foreground"
                  }
                >
                  {weddingDate
                    ? weddingDate.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : t("signup__book_details__date_placeholder")}
                </span>
              </div>
              <span className="bg-muted type-caption text-muted-foreground rounded-full px-2.5 py-1 font-medium">
                {weddingDate
                  ? weddingDate.toLocaleDateString("en-US", { weekday: "long" })
                  : t("signup__book_details__date_optional")}
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: showCalendar ? "1fr" : "0fr",
                opacity: showCalendar ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <div className="rounded-16 border-border bg-card mt-3 border p-4 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={weddingDate ?? undefined}
                    onSelect={(date) => {
                      updateFormData({ weddingDate: date ?? null });
                      setShowCalendar(false);
                    }}
                    disabled={{ before: new Date() }}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="venue" className="mb-2">
              {t("signup__book_details__venue_label")}
            </Label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => updateFormData({ venue: e.target.value })}
              placeholder={t("signup__book_details__venue_placeholder")}
            />
            <p className="type-caption text-muted-foreground mt-2">
              {t("signup__book_details__venue_hint")}
            </p>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!partner1Name || !partner2Name}
            size="lg"
            className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
          >
            {t("signup__book_details__continue")}
            <ArrowRightIcon width={16} height={16} />
          </Button>
        </>
      }
    />
  );
};
