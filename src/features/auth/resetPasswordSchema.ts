import { z } from "zod";

type T = (
  key: string,
  params?: Record<string, string | number | Date>,
) => string;

export const getResetPasswordSchema = (t: T) =>
  z
    .object({
      newPassword: z
        .string()
        .min(8, t("validation__password_min"))
        .max(128, t("validation__password_max")),
      confirmPassword: z
        .string()
        .min(1, t("validation__confirm_password_required")),
    })
    .refine((v) => v.newPassword === v.confirmPassword, {
      path: ["confirmPassword"],
      message: t("validation__passwords_match"),
    });

export type ResetPasswordFields = {
  newPassword: string;
  confirmPassword: string;
};
