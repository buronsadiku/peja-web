"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { VoiceMessagePreview } from "./VoiceMessagePreview";

export const SignInBrandPanel = () => {
  const t = useTranslations();
  return (
    <div className="from-primary to-primary/80 text-primary-foreground desktop:flex desktop:flex-col desktop:justify-between relative hidden overflow-hidden bg-gradient-to-br p-14">
      <div className="dark:bg-background/90 pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute -top-20 -right-20 size-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-15 -left-10 size-65 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)",
        }}
      />

      <Kicker className="relative tracking-[2.5px] opacity-70">
        {t("auth__signin__brand_eyebrow")}
      </Kicker>

      <div className="relative">
        <p className="type-h1 mb-6.5 leading-tight tracking-tight italic">
          &ldquo;{t("auth__signin__brand_quote")}&rdquo;
        </p>
        <VoiceMessagePreview
          name={t("auth__voice_message__name")}
          role={t("auth__voice_message__role")}
          duration="2:22"
          initial="M"
          tint="#EFC9A8"
        />
      </div>

      <p className="type-body-small relative max-w-105 leading-relaxed opacity-75">
        {t("auth__signin__brand_caption")}
      </p>
    </div>
  );
};
