"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { MessageSquareIcon } from "@peja/icons/MessageSquareIcon";
import { PlusIcon } from "@peja/icons/PlusIcon";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { CaptureCardHeader } from "./CaptureCardHeader";
import { NotePanel } from "./NotePanel";

export const NoteCaptureCard = () => {
  const t = useTranslations();
  const note = useGuestSubmissionStore((s) => s.note);
  const setNote = useGuestSubmissionStore((s) => s.setNote);
  const filled = note.trim().length > 0;
  const [editing, setEditing] = useState(false);

  const open = editing || filled;

  return (
    <div className="bg-card/65 border-border rounded-16 flex flex-col gap-4 border p-4 backdrop-blur-sm">
      <CaptureCardHeader
        icon={<MessageSquareIcon width={18} height={18} />}
        iconClassName="bg-secondary"
        title={t("guest__compose__note_title")}
        meta={
          filled
            ? t("guest__compose__note_captured", { count: note.length })
            : t("guest__compose__note_subtitle")
        }
        filled={filled}
      />

      {open && <NotePanel />}

      {open && filled && (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              setNote("");
              setEditing(false);
            }}
          >
            {t("guest__compose__remove")}
          </Button>
        </div>
      )}

      {!open && (
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={() => setEditing(true)}
        >
          <PlusIcon width={14} height={14} />
          {t("guest__compose__add_note")}
        </Button>
      )}
    </div>
  );
};
