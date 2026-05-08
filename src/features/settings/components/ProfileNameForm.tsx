"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Input } from "@peja/ui/components/Input";
import { profileClient } from "@/lib/api/profile-client";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/lib/api/types";
import { getProfileSchema, type ProfileFields } from "../profileSchema";
import { SettingsField } from "./SettingsField";

type ProfileNameFormProps = {
  user: User;
};

type Status =
  | { kind: "idle" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export const ProfileNameForm = ({ user }: ProfileNameFormProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const schema = useMemo(() => getProfileSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileFields>({
    defaultValues: { fullName: user.fullName ?? "" },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: ProfileFields) => {
    setStatus({ kind: "idle" });
    try {
      const { user: updated } = await profileClient.updateProfile({
        fullName: values.fullName,
      });
      reset({ fullName: updated.fullName ?? "" });
      setStatus({ kind: "saved" });
      router.refresh();
    } catch (error) {
      setStatus({
        kind: "error",
        message: ApiError.isApiError(error)
          ? error.message
          : t("settings__profile__save_error"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-6">
        <SettingsField
          label={t("settings__profile__name")}
          hint={t("settings__profile__name_hint")}
        >
          <Input
            type="text"
            autoComplete="name"
            placeholder={t("settings__profile__name_placeholder")}
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName")}
          />
          {errors.fullName && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.fullName.message}
            </span>
          )}
        </SettingsField>
        <SettingsField
          label={t("settings__profile__email")}
          value={user.email}
          hint={t("settings__profile__email_hint")}
        />
      </div>

      {status.kind === "error" && (
        <p className="type-body-small text-destructive mt-4" role="alert">
          {status.message}
        </p>
      )}
      {status.kind === "saved" && (
        <p className="type-body-small text-secondary mt-4">
          {t("settings__profile__saved")}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2.5">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="rounded-full"
        >
          {isSubmitting
            ? t("settings__profile__saving")
            : t("settings__profile__save")}
        </Button>
      </div>
    </form>
  );
};
