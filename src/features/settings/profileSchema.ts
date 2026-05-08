import { z } from "zod";

type T = (
  key: string,
  params?: Record<string, string | number | Date>,
) => string;

export const getProfileSchema = (t: T) =>
  z.object({
    fullName: z
      .string()
      .min(1, t("validation__name_required"))
      .max(100, t("validation__name_max")),
  });

export type ProfileFields = {
  fullName: string;
};
