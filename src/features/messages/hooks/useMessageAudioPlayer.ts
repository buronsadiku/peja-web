"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAudioPlayer } from "@peja/ui/hooks/useAudioPlayer";
import { messagesClient } from "@/lib/api/messages-client";
import { queryKeys } from "@/lib/query/keys";
import type { MessageDetail } from "@/lib/api/types";

export const useMessageAudioPlayer = (eventId: string) => {
  const qc = useQueryClient();

  const resolveSrc = useCallback(
    async (id: string): Promise<string | null> => {
      const key = queryKeys.messages.detail(eventId, id);
      const cached = qc.getQueryData<{ message: MessageDetail }>(key);
      if (cached?.message.audioUrl) return cached.message.audioUrl;
      const fetched = await qc.fetchQuery<{ message: MessageDetail }>({
        queryKey: key,
        queryFn: () => messagesClient.get(eventId, id),
      });
      return fetched.message.audioUrl;
    },
    [eventId, qc],
  );

  return useAudioPlayer({ resolveSrc });
};
