"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Input } from "@peja/ui/components/Input";
import { Label } from "@peja/ui/components/Label";
import { Kicker } from "@peja/ui/components/Kicker";
import { Logo } from "@peja/ui/components/Logo";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { authClient } from "@/lib/auth/client";
import {
  getForgotPasswordSchema,
  type ForgotPasswordFields,
} from "./forgotPasswordSchema";

type Status =
  | { kind: "idle" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string };

export const ForgotPasswordPage = () => {
  const t = useTranslations();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const schema = useMemo(() => getForgotPasswordSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFields>({
    defaultValues: { email: "" },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: ForgotPasswordFields) => {
    setStatus({ kind: "idle" });
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: appRoutes.auth.resetPassword,
    });
    if (error) {
      // Always present a success state; never confirm whether email exists
      setStatus({ kind: "sent", email: values.email });
      return;
    }
    setStatus({ kind: "sent", email: values.email });
  };

  return (
    <div className="tablet:px-20 mx-auto flex min-h-screen w-full max-w-130 flex-col px-6 py-12">
      <Logo />
      <div className="mt-16 flex flex-1 flex-col">
        <Kicker className="text-primary mb-2.5">
          {t("auth__forgot__eyebrow")}
        </Kicker>
        <h1 className="type-h1 leading-tight font-semibold tracking-tight">
          {t("auth__forgot__title")}{" "}
          <span className="text-primary italic">
            {t("auth__forgot__title_emphasis")}
          </span>
        </h1>
        <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
          {t("auth__forgot__subtitle")}
        </p>

        {status.kind === "sent" ? (
          <div className="rounded-12 border-border bg-muted/40 mt-9 border p-6">
            <p className="type-body-small text-foreground">
              {t.rich("auth__forgot__sent_card", {
                email: () => <strong>{status.email}</strong>,
              })}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-9">
            <div>
              <Label htmlFor="forgot-email" className="mb-2">
                {t("auth__email")}
              </Label>
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder={t("auth__forgot__email_placeholder")}
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <p className="type-caption text-destructive mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {status.kind === "error" && (
              <p className="type-body-small text-destructive mt-4" role="alert">
                {status.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
            >
              {isSubmitting
                ? t("auth__forgot__sending")
                : t("auth__forgot__submit")}
              <ArrowRightIcon width={16} height={16} />
            </Button>
          </form>
        )}

        <p className="type-body-small text-muted-foreground mt-9 text-center">
          {t("auth__forgot__remembered")}{" "}
          <Link
            href={appRoutes.auth.signIn}
            className="text-foreground font-semibold"
          >
            {t("auth__forgot__back_signin")}
          </Link>
        </p>
      </div>
    </div>
  );
};
