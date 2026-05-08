"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesClient } from "@/lib/api/messages-client";
import { queryKeys } from "@/lib/query/keys";
import {
  downloadManyMessages,
  type DownloadInputs,
} from "@/lib/media/downloadMessageAssets";
import type { MessageDetail, MessageSummary } from "@/lib/api/types";
import { useEventId } from "../context/MessagesEventContext";

const PAGE_LIMIT = 100;

const formatDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const fetchAllSummaries = async (
  eventId: string,
): Promise<MessageSummary[]> => {
  const all: MessageSummary[] = [];
  let cursor: string | undefined;
  do {
    const page = await messagesClient.list(eventId, {
      cursor,
      limit: PAGE_LIMIT,
    });
    all.push(...page.items);
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  return all;
};

export const useExportAllMessages = () => {
  const eventId = useEventId();
  const qc = useQueryClient();
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const mutation = useMutation({
    onError: (err) => {
      console.error("[exportAll] failed:", err);
    },
    mutationFn: async () => {
      const summaries = await fetchAllSummaries(eventId);
      if (summaries.length === 0) return;

      const inputs: DownloadInputs[] = await Promise.all(
        summaries.map(async (summary) => {
          const detailKey = queryKeys.messages.detail(eventId, summary.id);
          const cached =
            qc.getQueryData<{ message: MessageDetail }>(detailKey) ??
            (await qc.fetchQuery<{ message: MessageDetail }>({
              queryKey: detailKey,
              queryFn: () => messagesClient.get(eventId, summary.id),
            }));
          const photo = cached.message.media.find((m) => m.type === "photo");
          const video = cached.message.media.find((m) => m.type === "video");
          return {
            guestName: cached.message.guestNames || anonymous,
            audioUrl: cached.message.audioUrl,
            videoUrl: video?.url ?? null,
            photoUrl: photo?.url ?? null,
            writtenNote: cached.message.writtenNote,
          };
        }),
      );

      const folderName = `messages ${formatDate(new Date())}`;
      await downloadManyMessages(inputs, folderName, folderName);
    },
  });

  return {
    exportAll: () => mutation.mutate(),
    isExporting: mutation.isPending,
  };
};
