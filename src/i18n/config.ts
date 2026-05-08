export const locales = ["en", "sq"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
