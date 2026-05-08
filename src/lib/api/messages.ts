import { apiFetch, apiFetchPaginated } from "./server";
import type {
  ListMessagesQuery,
  MessageDetail,
  MessageSummary,
  UpdateMessageInput,
} from "./types";

const listPath = (eventId: string) => `/events/${eventId}/messages`;
const itemPath = (eventId: string, messageId: string) =>
  `/events/${eventId}/messages/${messageId}`;

export const messagesApi = {
  list: (eventId: string, query: ListMessagesQuery = {}) =>
    apiFetchPaginated<MessageSummary>(listPath(eventId), { query }),

  get: (eventId: string, messageId: string) =>
    apiFetch<{ message: MessageDetail }>(itemPath(eventId, messageId)),

  update: (eventId: string, messageId: string, input: UpdateMessageInput) =>
    apiFetch<{ message: { id: string; isFavorite: boolean } }>(
      itemPath(eventId, messageId),
      { method: "PATCH", body: input },
    ),

  remove: (eventId: string, messageId: string) =>
    apiFetch<void>(itemPath(eventId, messageId), { method: "DELETE" }),

  retranscribe: (
    eventId: string,
    messageId: string,
    input: { language?: string } = {},
  ) =>
    apiFetch<{ jobId: string }>(
      `${itemPath(eventId, messageId)}/retranscribe`,
      { method: "POST", body: input },
    ),
};
