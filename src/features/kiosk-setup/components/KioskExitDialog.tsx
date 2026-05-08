"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type KioskExitDialogProps = {
  open: boolean;
  expectedPin: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export const KioskExitDialog = ({
  open,
  expectedPin,
  onCancel,
  onConfirm,
}: KioskExitDialogProps) => {
  const t = useTranslations();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setDraft("");
      setError(false);
      return;
    }
    if (!expectedPin) {
      onConfirm();
      return;
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [open, expectedPin, onConfirm]);

  if (!open || !expectedPin) return null;

  const submit = () => {
    if (draft === expectedPin) {
      onConfirm();
    } else {
      setError(true);
      setDraft("");
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className="bg-foreground/85 fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="rounded-20 bg-card flex w-full max-w-sm flex-col items-center gap-4 p-7 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="type-h3 font-semibold tracking-tight">
          {t("kiosk__exit__title")}
        </h2>
        <p className="type-body-small text-muted-foreground text-center">
          {t("kiosk__exit__hint")}
        </p>
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          autoComplete="off"
          value={draft}
          onChange={(e) => {
            setError(false);
            setDraft(e.target.value.replace(/\D/g, "").slice(0, 4));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") onCancel();
          }}
          className="border-border focus:border-primary type-h2 w-40 rounded-full border-2 px-4 py-2 text-center font-mono tracking-widest outline-none transition-colors"
          placeholder="••••"
        />
        {error && (
          <p className="type-body-small text-destructive" role="alert">
            {t("kiosk__exit__wrong")}
          </p>
        )}
        <div className="mt-2 flex w-full gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border-border hover:bg-background type-body-small flex-1 cursor-pointer rounded-full border px-4 py-2.5 font-semibold transition-colors"
          >
            {t("kiosk__exit__cancel")}
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={draft.length !== 4}
            className="bg-foreground text-background type-body-small flex-1 cursor-pointer rounded-full px-4 py-2.5 font-semibold disabled:opacity-50"
          >
            {t("kiosk__exit__confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};
