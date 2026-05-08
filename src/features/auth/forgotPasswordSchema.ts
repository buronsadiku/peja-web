import { z } from "zod";

type T = (
  key: string,
  params?: Record<string, string | number | Date>,
) => string;

export const getForgotPasswordSchema = (t: T) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation__email_required"))
      .email(t("validation__email_invalid")),
  });

export type ForgotPasswordFields = { email: string };
