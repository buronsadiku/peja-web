import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/utils/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

const send = async ({ to, subject, html }: SendArgs) => {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — email skipped", {
      to,
      subject,
    });
    return;
  }
  await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
};

export const sendVerificationEmail = async (
  to: string,
  url: string,
  locale: string,
) => {
  const subjects: Record<string, string> = {
    en: "Verify your email",
    fr: "Vérifiez votre adresse e-mail",
    nl: "Bevestig je e-mailadres",
    de: "Bestätige deine E-Mail-Adresse",
    es: "Verifica tu correo electrónico",
    it: "Verifica la tua email",
  };
  const cta: Record<string, string> = {
    en: "Verify email",
    fr: "Vérifier",
    nl: "Bevestigen",
    de: "Bestätigen",
    es: "Verificar",
    it: "Verifica",
  };
  const lang = subjects[locale] ? locale : "en";
  await send({
    to,
    subject: subjects[lang]!,
    html: `<p>${subjects[lang]}</p><p><a href="${url}" rel="noreferrer">${cta[lang]}</a></p><p>This link expires in 24 hours.</p>`,
  });
};

export const sendResetPasswordEmail = async (
  to: string,
  url: string,
  locale: string,
) => {
  const subjects: Record<string, string> = {
    en: "Reset your password",
    fr: "Réinitialisez votre mot de passe",
    nl: "Stel je wachtwoord opnieuw in",
    de: "Passwort zurücksetzen",
    es: "Restablece tu contraseña",
    it: "Reimposta la password",
  };
  const cta: Record<string, string> = {
    en: "Reset password",
    fr: "Réinitialiser",
    nl: "Opnieuw instellen",
    de: "Zurücksetzen",
    es: "Restablecer",
    it: "Reimposta",
  };
  const lang = subjects[locale] ? locale : "en";
  await send({
    to,
    subject: subjects[lang]!,
    html: `<p>${subjects[lang]}</p><p><a href="${url}" rel="noreferrer">${cta[lang]}</a></p><p>This link expires in 1 hour. If you didn’t request this, ignore the email.</p>`,
  });
};
