"use client";

import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateMessage } from "@/lib/query/messagesQueries";
import { queryKeys } from "@/lib/query/keys";
import type { MessageDetail } from "@/lib/api/types";
import { useEventId } from "../context/MessagesEventContext";
import { useActiveMessageId } from "../store/useMessagesStore";
import { useMessageList } from "./useMessageList";
import { toMessageRowViewFromDetail } from "../adapters";

export const useMessageActions = () => {
  const eventId = useEventId();
  const activeId = useActiveMessageId();
  const { messageViews } = useMessageList();
  const updateMessage = useUpdateMessage(eventId);
  const qc = useQueryClient();
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const fromList = activeId
    ? (messageViews.find((m) => m.id === activeId) ?? null)
    : null;

  const cachedDetail = activeId
    ? qc.getQueryData<{ message: MessageDetail }>(
        queryKeys.messages.detail(eventId, activeId),
      )
    : null;

  const fromCache =
    !fromList && cachedDetail
      ? toMessageRowViewFromDetail(cachedDetail.message, anonymous)
      : null;

  const activeMessage = fromList ?? fromCache ?? null;

  const toggleFavorite = () => {
    if (!activeMessage) return;
    updateMessage.mutate({
      messageId: activeMessage.id,
      input: { isFavorite: !activeMessage.favorited },
    });
  };

  const toggleGoldBook = () => {
    if (!activeMessage) return;
    updateMessage.mutate({
      messageId: activeMessage.id,
      input: { isGoldBookSelected: !activeMessage.inGoldBook },
    });
  };

  return {
    activeMessage,
    toggleFavorite,
    toggleGoldBook,
    isPending: updateMessage.isPending,
  };
};
