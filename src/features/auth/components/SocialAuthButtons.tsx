"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@peja/ui/utils/cn";
import { authClient } from "@/lib/auth/client";
import { SocialAuthButton } from "./SocialAuthButton";
import { AppleIcon } from "@peja/icons/AppleIcon";
import { GoogleIcon } from "@peja/icons/GoogleIcon";

type SocialAuthButtonsProps = {
  action?: "sign-up" | "sign-in";
  className?: string;
};

type Provider = "google" | "apple";

export const SocialAuthButtons = ({
  action = "sign-up",
  className,
}: SocialAuthButtonsProps) => {
  const t = useTranslations();
  const label =
    action === "sign-in"
      ? t("auth__social__continue_with")
      : t("auth__social__sign_up_with");
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProvider = async (provider: Provider) => {
    setPending(provider);
    setError(null);
    const { error: providerError } = await authClient.signIn.social({
      provider,
      callbackURL: "/app",
    });
    if (providerError) {
      setPending(null);
      setError(providerError.message ?? t("auth__social__error_default"));
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2.5">
        <SocialAuthButton
          provider="Apple"
          label={label}
          icon={<AppleIcon />}
          disabled={true}
          onClick={() => handleProvider("apple")}
        />
        <SocialAuthButton
          provider="Google"
          label={label}
          icon={<GoogleIcon />}
          disabled={pending !== null}
          onClick={() => handleProvider("google")}
        />
      </div>
      {error && (
        <p className="type-caption text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
