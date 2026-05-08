"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateMessage } from "@/lib/query/messagesQueries";
import { queryKeys } from "@/lib/query/keys";
import type { MessageDetail } from "@/lib/api/types";
import type { TAudioPlayer } from "@peja/ui/hooks/useAudioPlayer";
import { useEventId } from "../context/MessagesEventContext";

export const useAudioDurationSync = (player: TAudioPlayer) => {
  const eventId = useEventId();
  const qc = useQueryClient();
  const updateMessage = useUpdateMessage(eventId);
  const syncedDurationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const id = player.playingId;
    const measured = player.duration;
    if (!id || !Number.isFinite(measured) || measured <= 0) return;
    if (syncedDurationsRef.current.has(id)) return;
    const detail = qc.getQueryData<{ message: MessageDetail }>(
      queryKeys.messages.detail(eventId, id),
    );
    const stored = detail?.message.audioDurationSec ?? null;
    const rounded = Math.round(measured);
    if (stored === rounded) {
      syncedDurationsRef.current.add(id);
      return;
    }
    syncedDurationsRef.current.add(id);
    updateMessage.mutate({
      messageId: id,
      input: { audioDurationSec: rounded },
    });
  }, [player.playingId, player.duration, eventId, qc, updateMessage]);
};
