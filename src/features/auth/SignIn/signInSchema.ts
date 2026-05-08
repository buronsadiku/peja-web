import { z } from "zod";

type T = (
  key: string,
  params?: Record<string, string | number | Date>,
) => string;

export const getSignInSchema = (t: T) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation__email_required"))
      .email(t("validation__email_invalid")),
    password: z.string().min(1, t("validation__password_required")),
    keepSignedIn: z.boolean(),
  });

export type SignInFields = {
  email: string;
  password: string;
  keepSignedIn: boolean;
};
