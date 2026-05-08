import { apiFetch } from "./server";
import type { PublicEvent } from "./types";

export const publicApi = {
  getEvent: (slug: string) => apiFetch<PublicEvent>(`/public/events/${slug}`),
};
