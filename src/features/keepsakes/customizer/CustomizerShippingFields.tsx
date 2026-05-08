"use client";

import { useTranslations } from "next-intl";
import { Input } from "@peja/ui/components/Input";
import { Label } from "@peja/ui/components/Label";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { OrderShippingFields } from "../orderShippingSchema";

type CustomizerShippingFieldsProps = {
  register: UseFormRegister<OrderShippingFields>;
  errors: FieldErrors<OrderShippingFields>;
};

export const CustomizerShippingFields = ({
  register,
  errors,
}: CustomizerShippingFieldsProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="ship-name" className="mb-2">
          {t("keepsakes__order__shipping_recipient")}
        </Label>
        <Input
          id="ship-name"
          autoComplete="name"
          placeholder={t("keepsakes__order__shipping_recipient_placeholder")}
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name && (
          <p className="type-caption text-destructive mt-1.5">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="ship-line1" className="mb-2">
          {t("keepsakes__order__shipping_address")}
        </Label>
        <Input
          id="ship-line1"
          autoComplete="address-line1"
          placeholder={t("keepsakes__order__shipping_address_placeholder")}
          aria-invalid={Boolean(errors.line1)}
          {...register("line1")}
        />
        {errors.line1 && (
          <p className="type-caption text-destructive mt-1.5">
            {errors.line1.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-[1fr_140px] gap-4">
        <div>
          <Label htmlFor="ship-city" className="mb-2">
            {t("keepsakes__order__shipping_city")}
          </Label>
          <Input
            id="ship-city"
            autoComplete="address-level2"
            placeholder={t("keepsakes__order__shipping_city_placeholder")}
            aria-invalid={Boolean(errors.city)}
            {...register("city")}
          />
          {errors.city && (
            <p className="type-caption text-destructive mt-1.5">
              {errors.city.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="ship-postal" className="mb-2">
            {t("keepsakes__order__shipping_postal")}
          </Label>
          <Input
            id="ship-postal"
            autoComplete="postal-code"
            placeholder={t("keepsakes__order__shipping_postal_placeholder")}
            aria-invalid={Boolean(errors.postalCode)}
            {...register("postalCode")}
          />
          {errors.postalCode && (
            <p className="type-caption text-destructive mt-1.5">
              {errors.postalCode.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="ship-country" className="mb-2">
          {t("keepsakes__order__shipping_country")}
        </Label>
        <Input
          id="ship-country"
          autoComplete="country"
          placeholder={t("keepsakes__order__shipping_country_placeholder")}
          maxLength={2}
          aria-invalid={Boolean(errors.country)}
          {...register("country")}
        />
        {errors.country && (
          <p className="type-caption text-destructive mt-1.5">
            {errors.country.message}
          </p>
        )}
      </div>
    </div>
  );
};
