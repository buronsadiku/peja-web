import { apiFetch } from "./server";
import type { Subscription } from "./types";

export const subscriptionsApi = {
  get: (eventId: string) =>
    apiFetch<{ subscription: Subscription | null }>(
      `/events/${eventId}/subscription`,
    ),
};
