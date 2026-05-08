"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { paymentsClient } from "@/lib/api/payments-client";
import { ApiError } from "@/lib/api/client";
import { env } from "@/lib/utils/env";
import {
  getOrderShippingSchema,
  type OrderShippingFields,
} from "../orderShippingSchema";
import { formatPrice } from "../designTokens";
import { CustomizerShippingFields } from "./CustomizerShippingFields";
import type {
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type CustomizerCheckoutFormProps = {
  product: KeepsakeProductDetail;
  eventId: string | null;
  customization: Record<string, unknown>;
  selectedVariant?: KeepsakeProductVariant | null;
  isReady: boolean;
  notReadyMessage?: string;
  children?: ReactNode;
  requiresShipping?: boolean;
};

export const CustomizerCheckoutForm = ({
  product,
  eventId,
  customization,
  selectedVariant,
  isReady,
  notReadyMessage,
  children,
  requiresShipping = true,
}: CustomizerCheckoutFormProps) => {
  const t = useTranslations();
  const schema = useMemo(() => getOrderShippingSchema(t), [t]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderShippingFields>({
    defaultValues: {
      name: "",
      line1: "",
      city: "",
      postalCode: "",
      country: "ES",
    },
    resolver: requiresShipping ? standardSchemaResolver(schema) : undefined,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: OrderShippingFields) => {
    if (!eventId) return;
    setSubmitError(null);
    try {
      const checkout = await paymentsClient.createCheckoutSession({
        eventId,
        orderType: "keepsake",
        items: [
          {
            productSku: product.sku,
            productVariantId: selectedVariant?.id,
            quantity: 1,
            customization,
          },
        ],
        shippingAddress: requiresShipping
          ? {
              name: values.name.trim(),
              line1: values.line1.trim(),
              city: values.city.trim(),
              postalCode: values.postalCode.trim(),
              country: values.country.trim().toUpperCase(),
            }
          : undefined,
        successUrl: `${env.APP_URL}/checkout/{CHECKOUT_SESSION_ID}/success`,
        cancelUrl: `${env.APP_URL}/checkout/{CHECKOUT_SESSION_ID}/cancel`,
      });
      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      setSubmitError(
        ApiError.isApiError(error)
          ? error.message
          : t("keepsakes__order__error_default"),
      );
    }
  };

  const effectivePriceCents =
    selectedVariant?.priceCents ?? product.basePriceCents;
  const buttonDisabled = !eventId || !isReady || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-20 border-border bg-card desktop:sticky desktop:top-6 flex flex-col gap-5 border p-6 self-start"
    >
      {children}
      {requiresShipping && (
        <CustomizerShippingFields register={register} errors={errors} />
      )}
      {submitError && (
        <p className="type-body-small text-destructive" role="alert">
          {submitError}
        </p>
      )}
      {!eventId && (
        <p className="type-body-small text-muted-foreground" role="status">
          {t("keepsakes__product__create_first")}
        </p>
      )}
      {eventId && !isReady && notReadyMessage && (
        <p className="type-body-small text-muted-foreground" role="status">
          {notReadyMessage}
        </p>
      )}
      <Button
        type="submit"
        disabled={buttonDisabled}
        className="rounded-full self-end"
      >
        {isSubmitting
          ? t("keepsakes__order__starting")
          : t("keepsakes__order__pay", {
              amount: formatPrice(effectivePriceCents, product.currency),
            })}
      </Button>
    </form>
  );
};
