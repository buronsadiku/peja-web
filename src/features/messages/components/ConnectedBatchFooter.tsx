"use client";

import { useMessageBulkActions } from "../hooks/useMessageBulkActions";
import { formatDurationLong } from "../utils";
import { MessageBatchFooter } from "./MessageBatchFooter";

export const ConnectedBatchFooter = () => {
  const {
    bulkFavorite,
    bulkAddToGoldBook,
    bulkDownload,
    isPending,
    allFavorited,
    allInGoldBook,
    selectedCount,
    selectedDurationSec,
  } = useMessageBulkActions();

  return (
    <MessageBatchFooter
      count={selectedCount}
      combinedDuration={formatDurationLong(selectedDurationSec)}
      onBulkFavorite={bulkFavorite}
      onBulkDownload={bulkDownload}
      onBulkAddToGoldBook={bulkAddToGoldBook}
      bulkPending={isPending}
      allFavorited={allFavorited}
      allInGoldBook={allInGoldBook}
    />
  );
};
