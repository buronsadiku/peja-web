"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Input } from "@peja/ui/components/Input";
import { Label } from "@peja/ui/components/Label";
import { Kicker } from "@peja/ui/components/Kicker";
import { Logo } from "@peja/ui/components/Logo";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { Link, useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { authClient } from "@/lib/auth/client";
import {
  getResetPasswordSchema,
  type ResetPasswordFields,
} from "./resetPasswordSchema";

export const ResetPasswordPage = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken =
    searchParams.get("access_token") ?? searchParams.get("token") ?? "";
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => getResetPasswordSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFields>({
    defaultValues: { newPassword: "", confirmPassword: "" },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: ResetPasswordFields) => {
    setSubmitError(null);
    if (!accessToken) {
      setSubmitError(t("auth__reset__missing_token"));
      return;
    }
    const { error } = await authClient.resetPassword({
      newPassword: values.newPassword,
      token: accessToken,
    });
    if (error) {
      setSubmitError(error.message ?? t("auth__reset__error_generic"));
      return;
    }
    router.replace(`${appRoutes.auth.signIn}?reset=ok`);
  };

  return (
    <div className="tablet:px-20 mx-auto flex min-h-screen w-full max-w-130 flex-col px-6 py-12">
      <Logo />
      <div className="mt-16 flex flex-1 flex-col">
        <Kicker className="text-primary mb-2.5">
          {t("auth__reset__eyebrow")}
        </Kicker>
        <h1 className="type-h1 leading-tight font-semibold tracking-tight">
          {t("auth__reset__title")}
          <br />
          <span className="text-primary italic">
            {t("auth__reset__title_emphasis")}
          </span>
        </h1>
        <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
          {t("auth__reset__subtitle")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-9">
          <div className="space-y-5">
            <div>
              <Label htmlFor="new-password" className="mb-2">
                {t("auth__reset__new_password_label")}
              </Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder={t("auth__reset__new_password_placeholder")}
                aria-invalid={Boolean(errors.newPassword)}
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="type-caption text-destructive mt-1.5">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirm-password" className="mb-2">
                {t("auth__reset__confirm_password_label")}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder={t("auth__reset__confirm_password_placeholder")}
                aria-invalid={Boolean(errors.confirmPassword)}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="type-caption text-destructive mt-1.5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {submitError && (
            <p className="type-body-small text-destructive mt-4" role="alert">
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
          >
            {isSubmitting ? t("auth__reset__saving") : t("auth__reset__submit")}
            <ArrowRightIcon width={16} height={16} />
          </Button>
        </form>

        <p className="type-body-small text-muted-foreground mt-9 text-center">
          <Link
            href={appRoutes.auth.signIn}
            className="text-foreground font-semibold"
          >
            {t("auth__reset__back_signin")}
          </Link>
        </p>
      </div>
    </div>
  );
};
