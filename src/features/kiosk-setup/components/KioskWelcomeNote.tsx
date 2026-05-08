"use client";

import { useTranslations } from "next-intl";
import { KIOSK_WELCOME_NOTE_MAX } from "@/lib/api/types";

type KioskWelcomeNoteProps = {
  value: string;
  onChange: (value: string) => void;
};

export const KioskWelcomeNote = ({ value, onChange }: KioskWelcomeNoteProps) => {
  const t = useTranslations();
  return (
    <div className="border-border border-b py-5">
      <div className="type-caption text-muted-foreground mb-2 font-semibold">
        {t("kiosk__config__welcome__note_label")}
      </div>
      <div className="rounded-12 border-border bg-card focus-within:border-primary relative min-h-24 border p-3.5 transition-colors">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, KIOSK_WELCOME_NOTE_MAX))}
          maxLength={KIOSK_WELCOME_NOTE_MAX}
          placeholder={t("kiosk__config__welcome__note_placeholder")}
          className="type-body-small min-h-16 w-full resize-none leading-relaxed outline-none"
          rows={3}
        />
        <span className="type-caption text-muted-foreground absolute right-3.5 bottom-2">
          {t("kiosk__config__welcome__counter", {
            count: value.length,
            max: KIOSK_WELCOME_NOTE_MAX,
          })}
        </span>
      </div>
    </div>
  );
};
