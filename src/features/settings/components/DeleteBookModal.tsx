"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { WarningIcon } from "@peja/icons/WarningIcon";
import { CheckIcon } from "@peja/icons/CheckIcon";
import { DeleteWarningItem } from "./DeleteWarningItem";

type DeleteBookModalProps = {
  coupleName: string;
  slug: string;
  pending: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const buildConfirmation = (coupleName: string) =>
  `delete ${coupleName.toLowerCase()}`;

export const DeleteBookModal = ({
  coupleName,
  slug,
  pending,
  onConfirm,
  onClose,
}: DeleteBookModalProps) => {
  const t = useTranslations();
  const [typed, setTyped] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const expected = buildConfirmation(coupleName);
  const canDelete = typed.trim().toLowerCase() === expected && acknowledged;

  const warnings = [
    t("settings__delete_modal__warn_view"),
    t("settings__delete_modal__warn_url", { slug }),
    t("settings__delete_modal__warn_recovery"),
  ];

  return (
    <div className="bg-foreground/45 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="rounded-20 bg-card w-full max-w-lg p-9 shadow-lg">
        <div className="rounded-16 bg-destructive/15 mb-4.5 flex size-14 items-center justify-center">
          <WarningIcon width={26} height={26} className="text-destructive" />
        </div>
        <h2 className="type-h2 leading-snug tracking-tight">
          {t.rich("settings__delete_modal__title", {
            name: coupleName,
            emph: (chunks) => <span className="italic">{chunks}</span>,
          })}
        </h2>
        <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
          {t("settings__delete_modal__body")}
        </p>

        <div className="rounded-12 border-destructive/20 bg-destructive/5 mt-4.5 border p-4">
          {warnings.map((warning) => (
            <DeleteWarningItem key={warning} text={warning} />
          ))}
        </div>

        <div className="mt-5.5">
          <label
            htmlFor="delete-confirm"
            className="type-caption text-muted-foreground mb-2 block"
          >
            {t.rich("settings__delete_modal__type_to_confirm", {
              phrase: expected,
              strong: (chunks) => (
                <strong className="text-foreground font-mono">{chunks}</strong>
              ),
            })}
          </label>
          <input
            id="delete-confirm"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={expected}
            className="rounded-12 border-destructive bg-background type-body-small w-full border-2 p-3 font-mono"
            autoComplete="off"
          />
        </div>

        <button
          type="button"
          onClick={() => setAcknowledged((v) => !v)}
          className="type-body-small text-muted-foreground mt-3.5 flex items-start gap-2.5 text-left"
        >
          <span
            className={`rounded-4 mt-0.5 flex size-4.5 shrink-0 items-center justify-center ${acknowledged ? "bg-destructive text-primary-foreground" : "border-border bg-card border"}`}
          >
            {acknowledged && <CheckIcon width={11} height={11} strokeWidth={3} />}
          </span>
          {t("settings__delete_modal__ack")}
        </button>

        <div className="mt-6.5 flex justify-end gap-2.5">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={onClose}
            disabled={pending}
          >
            {t("settings__delete_modal__keep")}
          </Button>
          <Button
            variant="destructive"
            className="rounded-full"
            onClick={onConfirm}
            disabled={!canDelete || pending}
          >
            {pending
              ? t("settings__delete_modal__deleting")
              : t("settings__delete_modal__delete")}
          </Button>
        </div>
      </div>
    </div>
  );
};
