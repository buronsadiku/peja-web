"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@peja/ui/components/Popover";
import { ChevronDownIcon } from "@peja/icons/ChevronDownIcon";
import { locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LanguageOption } from "./LanguageOption";

const LANGUAGE_LABEL_KEYS: Record<string, string> = {
  en: "guest__language__en",
  fr: "guest__language__fr",
  nl: "guest__language__nl",
  de: "guest__language__de",
  es: "guest__language__es",
  it: "guest__language__it",
};

export const LanguagePicker = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);

  const handleSelect = (locale: string) => {
    setOpen(false);
    router.replace(pathname, { locale });
  };

  const currentLabel = t(LANGUAGE_LABEL_KEYS[currentLocale] ?? "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="bg-card/85 border-border rounded-full inline-flex items-center gap-2 border px-3 py-2 backdrop-blur-sm shadow-sm"
        >
          <span className="bg-primary text-primary-foreground rounded-full inline-flex size-5 items-center justify-center type-caption font-bold tracking-wide">
            {currentLocale.toUpperCase()}
          </span>
          <span className="type-body-small font-semibold">{currentLabel}</span>
          <ChevronDownIcon
            width={14}
            height={14}
            className="text-muted-foreground"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="rounded-16 grid w-72 grid-cols-2 gap-1 p-2"
      >
        {locales.map((locale) => (
          <LanguageOption
            key={locale}
            code={locale}
            label={t(LANGUAGE_LABEL_KEYS[locale] ?? "")}
            active={locale === currentLocale}
            onSelect={handleSelect}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
};
