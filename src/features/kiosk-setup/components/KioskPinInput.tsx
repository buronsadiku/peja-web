"use client";

import { useState } from "react";

type KioskPinInputProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export const KioskPinInput = ({ value, onChange }: KioskPinInputProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(value ?? "");
          setEditing(true);
        }}
        className="border-border bg-card type-body-small hover:bg-background cursor-pointer rounded-full border px-3.5 py-2 font-mono tracking-widest transition-colors"
      >
        {value ? "•".repeat(4) : "Set PIN"}
      </button>
    );
  }

  const commit = () => {
    setEditing(false);
    if (draft.length === 0) {
      onChange(null);
      return;
    }
    if (/^\d{4}$/.test(draft)) {
      onChange(draft);
    }
  };

  return (
    <input
      autoFocus
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={4}
      value={draft}
      onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 4))}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") setEditing(false);
      }}
      placeholder="••••"
      className="border-primary bg-card type-body-small w-22 rounded-full border-2 px-3.5 py-2 text-center font-mono tracking-widest outline-none"
    />
  );
};
