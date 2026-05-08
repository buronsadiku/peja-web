"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@peja/icons/PlusIcon";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/api/types";
import { KioskLanguageChip } from "./KioskLanguageChip";

const FLAGS: Record<string, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  nl: "🇳🇱",
  de: "🇩🇪",
  es: "🇪🇸",
  it: "🇮🇹",
};

type KioskLanguagePickerProps = {
  defaultLanguage: string;
  supportedLanguages: string[];
  onChange: (next: {
    defaultLanguage?: SupportedLanguage;
    supportedLanguages?: SupportedLanguage[];
  }) => void;
};

export const KioskLanguagePicker = ({
  defaultLanguage,
  supportedLanguages,
  onChange,
}: KioskLanguagePickerProps) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const available = SUPPORTED_LANGUAGES.filter(
    (l) => !supportedLanguages.includes(l),
  );

  const handleAdd = (lang: SupportedLanguage) => {
    setOpen(false);
    onChange({ supportedLanguages: [...supportedLanguages, lang] as SupportedLanguage[] });
  };

  const handleRemove = (lang: string) => {
    if (lang === defaultLanguage) return;
    onChange({
      supportedLanguages: supportedLanguages.filter(
        (l) => l !== lang,
      ) as SupportedLanguage[],
    });
  };

  const handleSetMain = (lang: string) => {
    onChange({ defaultLanguage: lang as SupportedLanguage });
  };

  return (
    <div className="flex flex-wrap gap-2 py-5">
      {supportedLanguages.map((lang) => (
        <KioskLanguageChip
          key={lang}
          flag={FLAGS[lang] ?? "🌐"}
          label={t(`language__${lang}` as never)}
          isMain={lang === defaultLanguage}
          onSetMain={
            lang === defaultLanguage ? undefined : () => handleSetMain(lang)
          }
          onRemove={
            lang === defaultLanguage ? undefined : () => handleRemove(lang)
          }
        />
      ))}
      {available.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="border-border type-caption text-muted-foreground inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed px-3 py-2 font-semibold"
          >
            <PlusIcon width={12} height={12} />
            {t("kiosk__config__languages__add")}
          </button>
          {open && (
            <div className="rounded-12 border-border bg-card absolute top-full left-0 z-10 mt-1.5 min-w-40 border p-1.5 shadow-lg">
              {available.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleAdd(lang)}
                  className="type-body-small hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors"
                >
                  <span>{FLAGS[lang]}</span>
                  {t(`language__${lang}` as never)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
