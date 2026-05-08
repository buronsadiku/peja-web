"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { OtpInput } from "@peja/ui/components/OtpInput";
import { Logo } from "@peja/ui/components/Logo";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { useSignInStore } from "../useSignInStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { ShieldIcon } from "../components/ShieldIcon";

export const TwoFactorStep = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useSignInStore();
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(800px_500px_at_50%_0%,oklch(0.705_0.120_262.5/0.15),transparent_60%),radial-gradient(600px_400px_at_90%_100%,oklch(0.723_0.135_40/0.08),transparent_60%)]">
      <div className="w-full max-w-130 text-center">
        <Logo className="mx-auto mb-10 justify-center" />

        <ShieldIcon />

        <h1 className="type-h1 mt-5 leading-tight font-semibold tracking-tight">
          {t("auth__signin__twofactor__title")}
        </h1>
        <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-105 leading-relaxed">
          {t.rich("auth__signin__twofactor__body_full", {
            timer: (chunks) => (
              <strong className="text-destructive">{chunks}</strong>
            ),
          })}
        </p>

        <OtpInput
          value={formData.otpCode}
          onChange={(value) => updateFormData({ otpCode: value })}
          className="mt-10"
        />

        <div className="type-body-small text-muted-foreground mt-6 flex items-center justify-center gap-3.5">
          <button
            type="button"
            className="text-primary cursor-pointer font-semibold"
          >
            {t("auth__signin__twofactor__resend")}
          </button>
          <span className="opacity-30">&middot;</span>
          <button
            type="button"
            className="text-primary cursor-pointer font-semibold"
          >
            {t("auth__signin__twofactor__use_email")}
          </button>
        </div>

        <Button
          onClick={() => router.push(appRoutes.auth.signInWelcome)}
          disabled={formData.otpCode.length < 6}
          size="lg"
          className="shadow-primary/40 mt-9 rounded-full px-10 shadow-md"
        >
          {t("auth__signin__twofactor__verify")}
          <ArrowRightIcon width={16} height={16} />
        </Button>

        <p className="type-caption text-muted-foreground mt-11 font-serif italic">
          {t("auth__signin__twofactor__last_signin")}
        </p>
      </div>
    </div>
  );
};
