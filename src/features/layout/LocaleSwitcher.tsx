"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/config";

const labels: Record<string, string> = {
  en: "EN",
  sq: "SQ",
};

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale();

  return (
    <div className="inline-flex items-center gap-1 bg-card/40 border border-border/40 rounded-full p-1">
      <Globe className="w-3.5 h-3.5 text-muted-foreground ml-2" />
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          className={`text-xs font-bold px-2 py-1 rounded-full transition-all ${
            current === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {labels[l] ?? l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
