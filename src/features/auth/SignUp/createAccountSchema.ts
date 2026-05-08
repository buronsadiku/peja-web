import { z } from "zod";

type T = (
  key: string,
  params?: Record<string, string | number | Date>,
) => string;

export const getCreateAccountSchema = (t: T) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation__email_required"))
      .email(t("validation__email_invalid")),
    password: z
      .string()
      .min(8, t("validation__password_min"))
      .max(128, t("validation__password_max")),
    agreedToTerms: z.boolean().refine((v) => v === true, {
      message: t("validation__terms_required"),
    }),
  });

export type CreateAccountFields = {
  email: string;
  password: string;
  agreedToTerms: boolean;
};
