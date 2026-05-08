import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale;
  }

  const englishMessages = (await import("../../messages/en.json")).default;
  const localeMessages =
    locale === "en"
      ? englishMessages
      : (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages: { ...englishMessages, ...localeMessages },
  };
});
