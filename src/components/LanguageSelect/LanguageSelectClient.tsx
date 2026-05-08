"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { type Locale } from "@/i18n/config";
import { GlobeIcon } from "@peja/icons/GlobeIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@peja/ui/components/Select";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  nl: "NL",
  de: "DE",
  es: "ES",
  it: "IT",
};

type LanguageSelectClientProps = {
  availableLocales: Locale[];
};

export const LanguageSelectClient = ({
  availableLocales,
}: LanguageSelectClientProps) => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (value: string) => {
    document.cookie = `NEXT_LOCALE=${value};path=/;max-age=31536000`;
    router.replace(pathname, { locale: value as Locale });
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="border-none">
        <GlobeIcon className="size-3.5 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-40">
        {availableLocales.map((l) => (
          <SelectItem key={l} value={l}>
            {LOCALE_LABELS[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
