import { apiFetch } from "./server";
import type { InvitationStats } from "./types";

export const invitationsApi = {
  stats: (eventId: string) =>
    apiFetch<InvitationStats>(`/events/${eventId}/invitations/stats`),
};
