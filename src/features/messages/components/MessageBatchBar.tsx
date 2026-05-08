"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { BookIcon } from "@peja/icons/BookIcon";
import { CheckIcon } from "@peja/icons/CheckIcon";
import { DownloadIcon } from "@peja/icons/DownloadIcon";
import { HeartIcon } from "@peja/icons/HeartIcon";

type MessageBatchBarProps = {
  count: number;
  combinedDuration: string;
  allSelected?: boolean;
  onToggleAll?: () => void;
  onBulkFavorite?: () => void;
  onBulkDownload?: () => void;
  onBulkAddToGoldBook?: () => void;
  bulkPending?: boolean;
};

export const MessageBatchBar = ({
  count,
  combinedDuration,
  allSelected = false,
  onToggleAll,
  onBulkFavorite,
  onBulkDownload,
  onBulkAddToGoldBook,
  bulkPending = false,
}: MessageBatchBarProps) => {
  const t = useTranslations();
  const hasSelection = count > 0;

  return (
    <div className="border-border bg-card text-foreground tablet:px-6 flex items-center gap-3 border-b px-4 py-2.5">
      <button
        type="button"
        onClick={onToggleAll}
        aria-label={t("messages__select_all")}
        aria-pressed={allSelected}
        className={`rounded-4 flex size-5 cursor-pointer items-center justify-center border-[1.5px] transition-colors ${
          allSelected
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border bg-card text-transparent"
        }`}
      >
        <CheckIcon width={13} height={13} strokeWidth={2.5} />
      </button>

      <span className="type-body-small font-semibold">
        {hasSelection
          ? t("messages__batch__selected", { count })
          : t("messages__select_all")}
      </span>

      {hasSelection && (
        <>
          <span className="type-caption text-muted-foreground">
            {t("messages__batch__combined_duration", {
              duration: combinedDuration,
            })}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkFavorite}
              disabled={bulkPending}
              className="rounded-full"
            >
              <HeartIcon width={13} height={13} />
              {t("messages__batch__action_favourite")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDownload}
              disabled={bulkPending}
              className="rounded-full"
            >
              <DownloadIcon width={13} height={13} />
              {t("messages__batch__action_download")}
            </Button>
            <Button
              size="sm"
              onClick={onBulkAddToGoldBook}
              disabled={bulkPending}
              className="rounded-full"
            >
              <BookIcon width={13} height={13} />
              {t("messages__batch__add_to_book")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
