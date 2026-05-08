"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateMessage } from "@/lib/query/messagesQueries";
import { queryKeys } from "@/lib/query/keys";
import { messagesClient } from "@/lib/api/messages-client";
import { downloadManyMessages } from "@/lib/media/downloadMessageAssets";
import type { MessageDetail } from "@/lib/api/types";
import { useEventId } from "../context/MessagesEventContext";
import { useSelectedIds } from "../store/useMessagesStore";
import { useMessageList } from "./useMessageList";

type BulkInput =
  | { kind: "favorite"; ids: string[]; nextValue: boolean }
  | { kind: "goldbook"; ids: string[]; nextValue: boolean }
  | { kind: "download"; ids: string[] };

export const useMessageBulkActions = () => {
  const eventId = useEventId();
  const qc = useQueryClient();
  const { messageViews } = useMessageList();
  const selectedIds = useSelectedIds();
  const updateMessage = useUpdateMessage(eventId);
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const selectedViews = useMemo(
    () => messageViews.filter((m) => selectedIds.has(m.id)),
    [messageViews, selectedIds],
  );

  const allFavorited =
    selectedViews.length > 0 && selectedViews.every((m) => m.favorited);
  const allInGoldBook =
    selectedViews.length > 0 && selectedViews.every((m) => m.inGoldBook);
  const selectedDurationSec = selectedViews.reduce(
    (acc, m) => acc + m.durationSec,
    0,
  );

  const mutation = useMutation({
    mutationFn: async (input: BulkInput) => {
      if (input.kind === "favorite") {
        await Promise.all(
          input.ids.map((id) =>
            updateMessage.mutateAsync({
              messageId: id,
              input: { isFavorite: input.nextValue },
            }),
          ),
        );
        return;
      }
      if (input.kind === "goldbook") {
        await Promise.all(
          input.ids.map((id) =>
            updateMessage.mutateAsync({
              messageId: id,
              input: { isGoldBookSelected: input.nextValue },
            }),
          ),
        );
        return;
      }
      const inputs = await Promise.all(
        input.ids.map(async (id) => {
          const detailKey = queryKeys.messages.detail(eventId, id);
          const cached =
            qc.getQueryData<{ message: MessageDetail }>(detailKey) ??
            (await qc.fetchQuery<{ message: MessageDetail }>({
              queryKey: detailKey,
              queryFn: () => messagesClient.get(eventId, id),
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
      await downloadManyMessages(inputs, "messages");
    },
  });

  const ids = Array.from(selectedIds);

  return {
    bulkFavorite: () =>
      mutation.mutate({ kind: "favorite", ids, nextValue: !allFavorited }),
    bulkAddToGoldBook: () =>
      mutation.mutate({ kind: "goldbook", ids, nextValue: !allInGoldBook }),
    bulkDownload: () => mutation.mutate({ kind: "download", ids }),
    isPending: mutation.isPending,
    allFavorited,
    allInGoldBook,
    selectedCount: selectedIds.size,
    selectedDurationSec,
  };
};
