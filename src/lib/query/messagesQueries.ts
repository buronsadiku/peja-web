"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { messagesClient } from "@/lib/api/messages-client";
import type {
  ListMessagesQuery,
  MessageDetail,
  MessageSummary,
  UpdateMessageInput,
} from "@/lib/api/types";
import type { Paginated } from "@/lib/api/client";
import { queryKeys } from "./keys";

export const useMessagesList = (
  eventId: string,
  input: ListMessagesQuery = {},
) =>
  useQuery({
    queryKey: queryKeys.messages.list(eventId, input),
    queryFn: () => messagesClient.list(eventId, input),
    enabled: Boolean(eventId),
  });

export const useInfiniteMessagesList = (
  eventId: string,
  input: Omit<ListMessagesQuery, "cursor"> = {},
) =>
  useInfiniteQuery({
    queryKey: queryKeys.messages.infiniteList(eventId, input),
    queryFn: ({ pageParam }) =>
      messagesClient.list(eventId, {
        ...input,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? null,
    enabled: Boolean(eventId),
  });

export const useMessageDetail = (eventId: string, messageId: string | null) =>
  useQuery({
    queryKey: queryKeys.messages.detail(eventId, messageId ?? ""),
    queryFn: () => messagesClient.get(eventId, messageId!),
    enabled: Boolean(eventId && messageId),
  });

type ListSnapshot = Paginated<MessageSummary>;
type InfiniteSnapshot = InfiniteData<Paginated<MessageSummary>, string | null>;

const isInfiniteSnapshot = (value: unknown): value is InfiniteSnapshot =>
  typeof value === "object" &&
  value !== null &&
  Array.isArray((value as { pages?: unknown }).pages);

const isFlatSnapshot = (value: unknown): value is ListSnapshot =>
  typeof value === "object" &&
  value !== null &&
  Array.isArray((value as { items?: unknown }).items);

const patchInList = (
  list: ListSnapshot,
  messageId: string,
  patch: Partial<MessageSummary>,
): ListSnapshot => ({
  ...list,
  items: list.items.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
});

const removeFromList = (
  list: ListSnapshot,
  messageId: string,
): ListSnapshot => ({
  ...list,
  items: list.items.filter((m) => m.id !== messageId),
});

const transformAllLists = (
  qc: ReturnType<typeof useQueryClient>,
  eventId: string,
  transform: (snapshot: ListSnapshot) => ListSnapshot,
): { previous: [readonly unknown[], unknown][] } => {
  const entries = qc.getQueriesData<unknown>({
    queryKey: queryKeys.messages.all(eventId),
  });
  const previous: [readonly unknown[], unknown][] = [];
  for (const [key, snapshot] of entries) {
    if (isInfiniteSnapshot(snapshot)) {
      previous.push([key, snapshot]);
      qc.setQueryData<InfiniteSnapshot>(key, {
        ...snapshot,
        pages: snapshot.pages.map(transform),
      });
    } else if (isFlatSnapshot(snapshot)) {
      previous.push([key, snapshot]);
      qc.setQueryData<ListSnapshot>(key, transform(snapshot));
    }
  }
  return { previous };
};

const restoreSnapshots = (
  qc: ReturnType<typeof useQueryClient>,
  previous: [readonly unknown[], unknown][],
) => {
  for (const [key, snapshot] of previous) {
    qc.setQueryData(key, snapshot);
  }
};

type UpdateContext = {
  previous: [readonly unknown[], unknown][];
  previousDetail:
    | { key: readonly unknown[]; data: { message: MessageDetail } | undefined }
    | null;
};

export const useUpdateMessage = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<
    {
      message: {
        id: string;
        isFavorite: boolean;
        isGoldBookSelected: boolean;
      };
    },
    Error,
    { messageId: string; input: UpdateMessageInput },
    UpdateContext
  >({
    mutationFn: ({ messageId, input }) =>
      messagesClient.update(eventId, messageId, input),
    onMutate: async ({ messageId, input }) => {
      await qc.cancelQueries({ queryKey: queryKeys.messages.all(eventId) });

      const patch: Partial<MessageSummary> = {};
      if (typeof input.isFavorite === "boolean")
        patch.isFavorite = input.isFavorite;
      if (typeof input.isGoldBookSelected === "boolean")
        patch.isGoldBookSelected = input.isGoldBookSelected;

      const { previous } = transformAllLists(qc, eventId, (snap) =>
        patchInList(snap, messageId, patch),
      );

      const detailKey = queryKeys.messages.detail(eventId, messageId);
      const detailSnapshot = qc.getQueryData<{ message: MessageDetail }>(
        detailKey,
      );
      if (detailSnapshot) {
        qc.setQueryData<{ message: MessageDetail }>(detailKey, {
          message: { ...detailSnapshot.message, ...patch },
        });
      }

      return {
        previous,
        previousDetail: { key: detailKey, data: detailSnapshot },
      };
    },
    onError: (_err, _vars, context) => {
      if (context) {
        restoreSnapshots(qc, context.previous);
        if (context.previousDetail) {
          qc.setQueryData(
            context.previousDetail.key,
            context.previousDetail.data,
          );
        }
      }
    },
    onSuccess: (response, { messageId }) => {
      const detailKey = queryKeys.messages.detail(eventId, messageId);
      const current = qc.getQueryData<{ message: MessageDetail }>(detailKey);
      if (current) {
        qc.setQueryData<{ message: MessageDetail }>(detailKey, {
          message: {
            ...current.message,
            isFavorite: response.message.isFavorite,
            isGoldBookSelected: response.message.isGoldBookSelected,
          },
        });
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.messages.lists(eventId) });
    },
  });
};

type DeleteContext = { previous: [readonly unknown[], unknown][] };

export const useDeleteMessage = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<void, Error, string, DeleteContext>({
    mutationFn: (messageId) => messagesClient.remove(eventId, messageId),
    onMutate: async (messageId) => {
      await qc.cancelQueries({ queryKey: queryKeys.messages.all(eventId) });
      return transformAllLists(qc, eventId, (snap) =>
        removeFromList(snap, messageId),
      );
    },
    onError: (_err, _id, context) => {
      if (context) restoreSnapshots(qc, context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.messages.all(eventId) });
    },
  });
};

export const useRetranscribeMessage = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<
    { jobId: string },
    Error,
    { messageId: string; language?: string }
  >({
    mutationFn: ({ messageId, language }) =>
      messagesClient.retranscribe(eventId, messageId, language),
    onSettled: (_data, _err, { messageId }) => {
      qc.invalidateQueries({
        queryKey: queryKeys.messages.detail(eventId, messageId),
      });
      qc.invalidateQueries({ queryKey: queryKeys.messages.all(eventId) });
    },
  });
};

export type { InfiniteData };
