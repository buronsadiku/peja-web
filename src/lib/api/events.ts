import { apiFetch, apiFetchPaginated } from "./server";
import type {
  Event,
  EventStats,
  QrCodeResult,
  CreateEventInput,
  UpdateEventInput,
  ListEventsQuery,
} from "./types";

export const eventsApi = {
  list: (query: ListEventsQuery = {}) =>
    apiFetchPaginated<Event>("/events", { query }),

  get: (eventId: string) => apiFetch<{ event: Event }>(`/events/${eventId}`),

  create: (input: CreateEventInput) =>
    apiFetch<{ event: Event }>("/events", { method: "POST", body: input }),

  update: (eventId: string, input: UpdateEventInput) =>
    apiFetch<{ event: Event }>(`/events/${eventId}`, {
      method: "PATCH",
      body: input,
    }),

  remove: (eventId: string) =>
    apiFetch<void>(`/events/${eventId}`, { method: "DELETE" }),

  archive: (eventId: string) =>
    apiFetch<{ event: Event }>(`/events/${eventId}/archive`, {
      method: "POST",
    }),

  qrCode: (
    eventId: string,
    options: { format?: "png" | "svg"; size?: number } = {},
  ) =>
    apiFetch<QrCodeResult>(`/events/${eventId}/qr`, {
      query: { format: options.format, size: options.size },
    }),

  stats: (eventId: string) => apiFetch<EventStats>(`/events/${eventId}/stats`),
};
