import { z } from "zod";

type T = (
  key: string,
  params?: Record<string, string | number | Date>,
) => string;

export const getOrderShippingSchema = (t: T) =>
  z.object({
    name: z
      .string()
      .min(1, t("validation__shipping_name_required"))
      .max(120, t("validation__shipping_name_max")),
    line1: z
      .string()
      .min(1, t("validation__shipping_line1_required"))
      .max(200, t("validation__shipping_line1_max")),
    city: z
      .string()
      .min(1, t("validation__shipping_city_required"))
      .max(120, t("validation__shipping_city_max")),
    postalCode: z
      .string()
      .min(2, t("validation__shipping_postal_required"))
      .max(20, t("validation__shipping_postal_max")),
    country: z
      .string()
      .min(2, t("validation__shipping_country_required"))
      .max(2, t("validation__shipping_country_format")),
  });

export type OrderShippingFields = {
  name: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
};
