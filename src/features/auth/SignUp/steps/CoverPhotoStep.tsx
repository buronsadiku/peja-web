"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Kicker } from "@peja/ui/components/Kicker";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { ClockIcon } from "@peja/icons/ClockIcon";
import { SplitLayout } from "../components/SplitLayout";
import { BookPreview } from "../components/BookPreview";
import { CoverOption } from "../components/CoverOption";
import { CoverPattern } from "../components/CoverPattern";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

const COVER_OPTIONS = [
  {
    id: "upload",
    tint: "",
    labelKey: "signup__cover__option_upload",
    isUpload: true,
  },
  { id: "coastal", tint: "#B9C9D9", labelKey: "signup__cover__option_coastal" },
  { id: "garden", tint: "#B8D3B6", labelKey: "signup__cover__option_garden" },
  {
    id: "terracotta",
    tint: "#EFC9A8",
    labelKey: "signup__cover__option_terracotta",
  },
  {
    id: "lavender",
    tint: "#C8B5D9",
    labelKey: "signup__cover__option_lavender",
  },
  { id: "rose", tint: "#E9BFC4", labelKey: "signup__cover__option_rose" },
];

const ACCEPT_MIME = "image/jpeg,image/png,image/webp,image/heic";
const MAX_BYTES = 25 * 1024 * 1024;

export const CoverPhotoStep = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (formData.coverFilePreview) {
        URL.revokeObjectURL(formData.coverFilePreview);
      }
    };
  }, [formData.coverFilePreview]);

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/") || file.size > MAX_BYTES) {
      return;
    }
    if (formData.coverFilePreview) {
      URL.revokeObjectURL(formData.coverFilePreview);
    }
    const preview = URL.createObjectURL(file);
    updateFormData({
      coverType: "upload",
      coverFile: file,
      coverFilePreview: preview,
    });
  };

  const handleSelectPreset = (id: string) => {
    if (id === "upload") {
      handlePickFile();
      return;
    }
    if (formData.coverFilePreview) {
      URL.revokeObjectURL(formData.coverFilePreview);
    }
    updateFormData({
      coverType: id,
      coverFile: null,
      coverFilePreview: null,
    });
  };

  return (
    <SplitLayout
      left={
        <>
          <Kicker className="relative tracking-[2.5px] opacity-80">
            {t("signup__cover__brand_eyebrow")}
          </Kicker>
          <div className="relative">
            <BookPreview
              partner1={formData.partner1Name}
              partner2={formData.partner2Name}
              date={formData.weddingDate?.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              venue={formData.venue}
              coverImage={
                formData.coverFilePreview ? (
                  <img
                    src={formData.coverFilePreview}
                    alt={t("signup__cover__step_label")}
                    className="size-full object-cover"
                  />
                ) : formData.coverType && formData.coverType !== "upload" ? (
                  <CoverPattern
                    tint={
                      COVER_OPTIONS.find((o) => o.id === formData.coverType)
                        ?.tint ?? "#EFC9A8"
                    }
                  />
                ) : undefined
              }
            />
          </div>
          <p className="type-body-small relative max-w-90 leading-relaxed opacity-85">
            {t("signup__cover__brand_caption")}
          </p>
        </>
      }
      right={
        <>
          <Kicker className="text-primary mb-3">
            {t("auth__signup__eyebrow_step", {
              step: 4,
              label: t("signup__cover__step_label"),
            })}
          </Kicker>
          <h1 className="type-h1 leading-tight font-semibold tracking-tight">
            {t("signup__cover__title_a")}
            <br />
            <span className="text-primary italic">
              {t("signup__cover__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
            {t("signup__cover__subtitle")}
          </p>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {COVER_OPTIONS.map((option) => (
              <CoverOption
                key={option.id}
                label={t(option.labelKey)}
                tint={option.tint}
                isUpload={option.isUpload}
                selected={formData.coverType === option.id}
                initials={`${formData.partner1Name?.[0] ?? "L"}&${formData.partner2Name?.[0] ?? "T"}`}
                onClick={() => handleSelectPreset(option.id)}
              />
            ))}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_MIME}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />

          {formData.coverFile && (
            <div className="rounded-12 bg-primary/5 mt-4 flex items-center gap-3 p-3">
              <div className="size-10 overflow-hidden rounded-md">
                {formData.coverFilePreview && (
                  <img
                    src={formData.coverFilePreview}
                    alt=""
                    className="size-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="type-body-small text-foreground truncate font-semibold">
                  {formData.coverFile.name}
                </p>
                <p className="type-caption text-muted-foreground">
                  {t("signup__cover__file_size", {
                    size: (formData.coverFile.size / (1024 * 1024)).toFixed(1),
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={handlePickFile}
                className="type-caption text-primary cursor-pointer font-semibold"
              >
                {t("signup__cover__change")}
              </button>
            </div>
          )}

          <div className="type-body-small text-muted-foreground mt-6 flex items-center gap-2.5">
            <ClockIcon width={14} height={14} />
            {t("signup__cover__skip")}
          </div>

          <Button
            onClick={() => router.push(appRoutes.auth.signUpStep(5))}
            size="lg"
            className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
          >
            {t("signup__cover__continue")}
            <ArrowRightIcon width={16} height={16} />
          </Button>
        </>
      }
    />
  );
};
