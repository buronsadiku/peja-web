"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Input } from "@peja/ui/components/Input";
import { Label } from "@peja/ui/components/Label";
import { Checkbox } from "@peja/ui/components/Checkbox";
import { Separator } from "@peja/ui/components/Separator";
import { Kicker } from "@peja/ui/components/Kicker";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { SplitLayout } from "../components/SplitLayout";
import { SocialAuthButtons } from "../../components/SocialAuthButtons";
import { ChecklistItem } from "../components/ChecklistItem";
import { useSignUpStore } from "../useSignUpStore";
import { Link, useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { authClient } from "@/lib/auth/client";
import {
  getCreateAccountSchema,
  type CreateAccountFields,
} from "../createAccountSchema";

export const CreateAccountStep = () => {
  const t = useTranslations();
  const router = useRouter();
  const updateFormData = useSignUpStore((s) => s.updateFormData);
  const storedEmail = useSignUpStore((s) => s.formData.email);
  const storedAgreed = useSignUpStore((s) => s.formData.agreedToTerms);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => getCreateAccountSchema(t), [t]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFields>({
    defaultValues: {
      email: storedEmail,
      password: "",
      agreedToTerms: storedAgreed,
    },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: CreateAccountFields) => {
    setSubmitError(null);
    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.email.split("@")[0] ?? values.email,
    });
    if (error) {
      setSubmitError(
        error.message ?? t("auth__signup__create_account__error_generic"),
      );
      return;
    }
    updateFormData({ email: values.email, agreedToTerms: true });
    router.push(appRoutes.auth.signUpStep(2));
  };

  const setupSteps = [
    t("auth__signup__brand_step__create_account"),
    t("auth__signup__brand_step__name_book"),
    t("auth__signup__brand_step__cover_link"),
    t("auth__signup__brand_step__choose_plan"),
  ];

  return (
    <SplitLayout
      left={
        <>
          <Kicker className="relative tracking-[2.5px] opacity-80">
            {t("auth__signup__brand_eyebrow")}
          </Kicker>
          <p className="relative font-serif text-5xl leading-tight font-medium tracking-tight">
            {t("auth__signup__brand_intro")}
          </p>
          <div className="relative flex flex-col gap-3.5">
            {setupSteps.map((label, i) => (
              <ChecklistItem
                key={label}
                index={i + 1}
                label={label}
                active={i === 0}
              />
            ))}
          </div>
        </>
      }
      right={
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Kicker className="text-primary mb-3">
            {t("auth__signup__eyebrow_step", {
              step: 1,
              label: t("auth__signup__create_account__label"),
            })}
          </Kicker>
          <h1 className="type-h1 leading-tight font-semibold tracking-tight">
            {t("auth__signup__create_account__title")}
            <br />
            <span className="text-primary italic">
              {t("auth__signup__create_account__title_emphasis")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
            {t("auth__signup__create_account__subtitle")}
          </p>

          <SocialAuthButtons action="sign-up" className="mt-8" />

          <Separator
            label={t("auth__signup__create_account__separator")}
            className="my-6"
          />

          <div className="space-y-5">
            <div>
              <Label htmlFor="signup-email" className="mb-2">
                {t("auth__signup__create_account__email_label")}
              </Label>
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder={t(
                  "auth__signup__create_account__email_placeholder",
                )}
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
              <Label htmlFor="signup-password" className="mb-2">
                {t("auth__signup__create_account__password_label")}
              </Label>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder={t(
                  "auth__signup__create_account__password_placeholder",
                )}
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              {errors.password ? (
                <p className="type-caption text-destructive mt-1.5">
                  {errors.password.message}
                </p>
              ) : (
                <p className="type-caption text-muted-foreground mt-2">
                  {t("auth__signup__create_account__password_hint")}
                </p>
              )}
            </div>
          </div>

          <Controller
            control={control}
            name="agreedToTerms"
            render={({ field, fieldState }) => (
              <div className="mt-6">
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  label={
                    <span>
                      {t.rich("auth__signup__create_account__terms_label", {
                        terms: (chunks) => (
                          <Link
                            href={appRoutes.legal.terms}
                            className="text-primary font-semibold"
                          >
                            {chunks}
                          </Link>
                        ),
                        privacy: (chunks) => (
                          <Link
                            href={appRoutes.legal.privacy}
                            className="text-primary font-semibold"
                          >
                            {chunks}
                          </Link>
                        ),
                      })}
                    </span>
                  }
                />
                {fieldState.error && (
                  <p className="type-caption text-destructive mt-1.5">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

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
              ? t("auth__signup__create_account__submit_pending")
              : t("auth__signup__create_account__submit")}
            <ArrowRightIcon width={16} height={16} />
          </Button>

          <p className="type-body-small text-muted-foreground mt-4.5 text-center">
            {t("auth__signup__create_account__has_account")}{" "}
            <Link
              href={appRoutes.auth.signIn}
              className="text-foreground font-semibold"
            >
              {t("auth__signup__create_account__signin_cta")}
            </Link>
          </p>
        </form>
      }
    />
  );
};
