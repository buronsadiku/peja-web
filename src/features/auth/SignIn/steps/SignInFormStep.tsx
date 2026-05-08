"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Input } from "@peja/ui/components/Input";
import { Label } from "@peja/ui/components/Label";
import { Checkbox } from "@peja/ui/components/Checkbox";
import { Separator } from "@peja/ui/components/Separator";
import { Kicker } from "@peja/ui/components/Kicker";
import { Logo } from "@peja/ui/components/Logo";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { SocialAuthButtons } from "../../components/SocialAuthButtons";
import { SignInBrandPanel } from "../components/SignInBrandPanel";
import { Link, useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { authClient } from "@/lib/auth/client";
import { getSignInSchema, type SignInFields } from "../signInSchema";

export const SignInFormStep = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => getSignInSchema(t), [t]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInFields>({
    defaultValues: { email: "", password: "", keepSignedIn: true },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: SignInFields) => {
    setSubmitError(null);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setSubmitError(error.message ?? t("auth__signin__error_generic"));
      return;
    }
    const redirectTo = searchParams.get("redirect") ?? appRoutes.app.root;
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <div className="desktop:grid-cols-2 grid min-h-screen">
      <div className="tablet:px-20 flex flex-col items-center px-6 py-12">
        <Logo className="self-start" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex w-full flex-1 flex-col justify-center"
          style={{ maxWidth: 440 }}
        >
          <Kicker className="text-primary mb-2.5">
            {t("auth__signin__eyebrow")}
          </Kicker>
          <h1 className="type-display leading-[1.05] font-semibold tracking-tight">
            {t("auth__signin__title")}
            <br />
            <span className="text-primary italic">
              {t("auth__signin__title_emphasis")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mt-3.5 leading-relaxed">
            {t("auth__signin__subtitle")}
          </p>

          <SocialAuthButtons action="sign-in" className="mt-9" />

          <Separator label={t("auth__signin__separator")} className="my-6" />

          <div className="space-y-4.5">
            <div>
              <Label htmlFor="signin-email" className="mb-2">
                {t("auth__email")}
              </Label>
              <Input
                id="signin-email"
                type="email"
                autoComplete="email"
                placeholder={t("auth__signin__email_placeholder")}
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <p className="type-caption text-destructive mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="signin-password" className="mb-2">
                {t("auth__password")}
              </Label>
              <Input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                placeholder={t("auth__signin__password_placeholder")}
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              {errors.password && (
                <p className="type-caption text-destructive mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Controller
              control={control}
              name="keepSignedIn"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  label={t("auth__signin__keep_signed_in")}
                />
              )}
            />
            <Link
              href={appRoutes.auth.forgotPassword}
              className="type-body-small text-primary font-semibold"
            >
              {t("auth__forgot_password")}
            </Link>
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
            {isSubmitting
              ? t("auth__signin__submit_pending")
              : t("auth__signin__submit")}
            <ArrowRightIcon width={16} height={16} />
          </Button>

          <p className="type-body-small text-muted-foreground mt-4.5 text-center">
            {t("auth__signin__no_account")}{" "}
            <Link
              href={appRoutes.auth.signUp}
              className="text-foreground font-semibold"
            >
              {t("auth__signin__signup_cta")}
            </Link>
          </p>
        </form>

        <p className="type-caption text-muted-foreground/60 self-start">
          {t("auth__signin__protected")}
        </p>
      </div>

      <SignInBrandPanel />
    </div>
  );
};
