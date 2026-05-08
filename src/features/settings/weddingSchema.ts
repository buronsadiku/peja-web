import { z } from "zod";

type T = (
  key: string,
  params?: Record<string, string | number | Date>,
) => string;

const SLUG_RE = /^[a-z0-9-]+$/;

export const getWeddingSchema = (t: T) =>
  z.object({
    partnerAName: z
      .string()
      .min(1, t("validation__partner_name_required"))
      .max(50, t("validation__partner_name_max")),
    partnerBName: z
      .string()
      .min(1, t("validation__partner_name_required"))
      .max(50, t("validation__partner_name_max")),
    weddingDate: z.string().max(20).optional(),
    venueName: z.string().max(100).optional(),
    venueCity: z.string().max(100).optional(),
    welcomeMessage: z.string().max(200).optional(),
    slug: z
      .string()
      .max(20)
      .refine(
        (v) => v === "" || (v.length >= 4 && SLUG_RE.test(v)),
        t("validation__slug_format"),
      ),
    defaultLanguage: z.enum(["en", "fr", "nl", "de", "es", "it"]),
  });

export type WeddingFields = {
  partnerAName: string;
  partnerBName: string;
  weddingDate?: string;
  venueName?: string;
  venueCity?: string;
  welcomeMessage?: string;
  slug: string;
  defaultLanguage: "en" | "fr" | "nl" | "de" | "es" | "it";
};
