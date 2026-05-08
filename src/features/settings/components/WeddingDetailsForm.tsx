"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Input } from "@peja/ui/components/Input";
import { CalendarIcon } from "@peja/icons/CalendarIcon";
import { MapPinIcon } from "@peja/icons/MapPinIcon";
import { eventsClient } from "@/lib/api/events-client";
import { ApiError } from "@/lib/api/client";
import type { Event, SupportedLanguage } from "@/lib/api/types";
import { getWeddingSchema, type WeddingFields } from "../weddingSchema";
import { SettingsField } from "./SettingsField";

type WeddingDetailsFormProps = {
  event: Event;
};

type Status =
  | { kind: "idle" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

const LANG_KEYS: { value: SupportedLanguage; labelKey: string }[] = [
  { value: "en", labelKey: "settings__wedding__lang_en" },
  { value: "fr", labelKey: "settings__wedding__lang_fr" },
  { value: "nl", labelKey: "settings__wedding__lang_nl" },
  { value: "de", labelKey: "settings__wedding__lang_de" },
  { value: "es", labelKey: "settings__wedding__lang_es" },
  { value: "it", labelKey: "settings__wedding__lang_it" },
];

const toIsoDate = (raw: string | null): string => {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toISOString().slice(0, 10);
};

export const WeddingDetailsForm = ({ event }: WeddingDetailsFormProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const schema = useMemo(() => getWeddingSchema(t), [t]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<WeddingFields>({
    defaultValues: {
      partnerAName: event.partnerAName,
      partnerBName: event.partnerBName,
      weddingDate: toIsoDate(event.weddingDate),
      venueName: event.venueName ?? "",
      venueCity: event.venueCity ?? "",
      welcomeMessage: event.welcomeMessage ?? "",
      slug: event.slug,
      defaultLanguage: (event.defaultLanguage as SupportedLanguage) ?? "en",
    },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const welcomeMessage = useWatch({ control, name: "welcomeMessage" }) ?? "";

  const onSubmit = async (values: WeddingFields) => {
    setStatus({ kind: "idle" });
    try {
      const { event: updated } = await eventsClient.update(event.id, {
        partnerAName: values.partnerAName,
        partnerBName: values.partnerBName,
        weddingDate: values.weddingDate || undefined,
        venueName: values.venueName || undefined,
        venueCity: values.venueCity || undefined,
        welcomeMessage: values.welcomeMessage || undefined,
        slug: values.slug || undefined,
        defaultLanguage: values.defaultLanguage,
      });
      reset({
        partnerAName: updated.partnerAName,
        partnerBName: updated.partnerBName,
        weddingDate: toIsoDate(updated.weddingDate),
        venueName: updated.venueName ?? "",
        venueCity: updated.venueCity ?? "",
        welcomeMessage: updated.welcomeMessage ?? "",
        slug: updated.slug,
        defaultLanguage: (updated.defaultLanguage as SupportedLanguage) ?? "en",
      });
      setStatus({ kind: "saved" });
      router.refresh();
    } catch (error) {
      setStatus({
        kind: "error",
        message: ApiError.isApiError(error)
          ? error.message
          : t("settings__wedding__save_error"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-6">
        <SettingsField label={t("settings__wedding__partnerA")}>
          <Input
            type="text"
            placeholder={t("settings__wedding__placeholder_partner_a")}
            aria-invalid={Boolean(errors.partnerAName)}
            {...register("partnerAName")}
          />
          {errors.partnerAName && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.partnerAName.message}
            </span>
          )}
        </SettingsField>
        <SettingsField label={t("settings__wedding__partnerB")}>
          <Input
            type="text"
            placeholder={t("settings__wedding__placeholder_partner_b")}
            aria-invalid={Boolean(errors.partnerBName)}
            {...register("partnerBName")}
          />
          {errors.partnerBName && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.partnerBName.message}
            </span>
          )}
        </SettingsField>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-6">
        <SettingsField
          label={t("settings__wedding__date")}
          adornmentRight={
            <CalendarIcon
              width={16}
              height={16}
              className="text-muted-foreground"
            />
          }
        >
          <Input type="date" {...register("weddingDate")} />
        </SettingsField>
        <SettingsField label={t("settings__wedding__language")}>
          <select
            {...register("defaultLanguage")}
            className="border-border bg-card text-foreground rounded-12 type-body-small w-full border px-3.5 py-3"
          >
            {LANG_KEYS.map((l) => (
              <option key={l.value} value={l.value}>
                {t(l.labelKey)}
              </option>
            ))}
          </select>
        </SettingsField>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-6">
        <SettingsField label={t("settings__wedding__venue_name")}>
          <Input
            type="text"
            placeholder={t("settings__wedding__venue_name_placeholder")}
            {...register("venueName")}
          />
        </SettingsField>
        <SettingsField
          label={t("settings__wedding__venue_city")}
          adornmentRight={
            <MapPinIcon width={16} height={16} className="text-muted-foreground" />
          }
        >
          <Input
            type="text"
            placeholder={t("settings__wedding__venue_city_placeholder")}
            {...register("venueCity")}
          />
        </SettingsField>
      </div>

      <div className="mt-5">
        <SettingsField
          label={t("settings__wedding__welcome_note")}
          hint={t("settings__wedding__welcome_note_hint", {
            count: welcomeMessage.length,
          })}
        >
          <textarea
            {...register("welcomeMessage")}
            placeholder={t("settings__wedding__welcome_note_placeholder")}
            rows={3}
            className="border-border bg-card text-foreground rounded-12 type-body-small w-full border p-4 font-serif leading-relaxed outline-none"
          />
          {errors.welcomeMessage && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.welcomeMessage.message}
            </span>
          )}
        </SettingsField>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-6">
        <SettingsField
          label={t("settings__wedding__public_link")}
          hint={t("settings__wedding__public_link_hint")}
        >
          <div className="rounded-12 border-border bg-card flex items-center gap-2 border px-3.5">
            <span className="type-body-small text-muted-foreground">
              peja.love/
            </span>
            <input
              type="text"
              className="type-body-small text-foreground flex-1 bg-transparent py-3 outline-none"
              {...register("slug")}
            />
          </div>
          {errors.slug && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.slug.message}
            </span>
          )}
        </SettingsField>
      </div>

      {status.kind === "error" && (
        <p className="type-body-small text-destructive mt-4" role="alert">
          {status.message}
        </p>
      )}
      {status.kind === "saved" && (
        <p className="type-body-small text-secondary mt-4">
          {t("settings__wedding__saved")}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-2.5">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="rounded-full"
        >
          {isSubmitting
            ? t("settings__wedding__saving")
            : t("settings__wedding__save")}
        </Button>
      </div>
    </form>
  );
};
