import { existsSync } from "fs";
import { join } from "path";
import { locales, type Locale } from "@/i18n/config";
import { LanguageSelectClient } from "./LanguageSelectClient";

export const LanguageSelect = () => {
  const messagesDir = join(process.cwd(), "messages");
  const availableLocales = locales.filter((l) =>
    existsSync(join(messagesDir, `${l}.json`)),
  ) as Locale[];

  return <LanguageSelectClient availableLocales={availableLocales} />;
};
