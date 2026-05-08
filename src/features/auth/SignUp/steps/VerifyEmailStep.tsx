"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { useSignUpStore } from "../useSignUpStore";
import { authClient } from "@/lib/auth/client";
import { MailIcon } from "../components/MailIcon";

type ResendState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

export const VerifyEmailStep = () => {
  const t = useTranslations();
  const email = useSignUpStore((s) => s.formData.email);
  const [resend, setResend] = useState<ResendState>({ status: "idle" });

  const handleResend = async () => {
    if (!email) return;
    setResend({ status: "sending" });
    const { error } = await authClient.sendVerificationEmail({ email });
    if (error) {
      setResend({
        status: "error",
        message: error.message ?? t("auth__verify__resend_error"),
      });
      return;
    }
    setResend({ status: "sent" });
  };

  return (
    <div className="flex min-h-[calc(100vh-89px)] items-center justify-center bg-[radial-gradient(800px_500px_at_50%_0%,_oklch(0.705_0.120_262.5/0.12),_transparent_60%),radial-gradient(600px_400px_at_80%_100%,_oklch(0.723_0.135_40/0.08),_transparent_60%)]">
      <div className="w-full max-w-130 text-center">
        <MailIcon />

        <Kicker className="text-primary">
          {t("auth__signup__eyebrow_step", {
            step: 2,
            label: t("auth__verify__step_label"),
          })}
        </Kicker>
        <h1 className="type-h1 mt-3 leading-tight font-semibold tracking-tight">
          {t("auth__verify__check_inbox")}
        </h1>
        <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-105 leading-relaxed">
          {t.rich("auth__verify__sent_to", {
            email: () => (
              <strong className="text-foreground">
                {email || t("auth__verify__sent_to_fallback")}
              </strong>
            ),
          })}
        </p>

        <div className="type-body-small text-muted-foreground mt-9 flex items-center justify-center gap-3.5">
          {t("auth__verify__didnt_get")}{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resend.status === "sending" || !email}
            className="text-primary cursor-pointer font-semibold disabled:opacity-50"
          >
            {resend.status === "sending"
              ? t("auth__verify__sending")
              : t("auth__verify__send_again")}
          </button>
        </div>

        {resend.status === "sent" && (
          <p className="type-caption text-primary mt-4">
            {t("auth__verify__resent")}
          </p>
        )}
        {resend.status === "error" && (
          <p className="type-caption text-destructive mt-4" role="alert">
            {resend.message}
          </p>
        )}

        <p className="type-caption text-muted-foreground mt-11 font-serif italic">
          {t("auth__verify__tip")}
        </p>
      </div>
    </div>
  );
};
