import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { invitationsApi } from "@/lib/api/invitations";
import { env } from "@/lib/utils/env";
import { GuestsEmptyState } from "./components/GuestsEmptyState";
import { GuestsPageClient } from "./GuestsPageClient";

const ignoreNotFound = <T,>(error: unknown, fallback: T): T => {
  if (ApiError.isApiError(error) && error.status === 404) return fallback;
  throw error;
};

export const GuestsPage = async () => {
  const eventsPage = await eventsApi.list({ limit: 1 });
  const event = eventsPage.items[0];
  if (!event) return <GuestsEmptyState />;

  const [stats, invitations] = await Promise.all([
    eventsApi.stats(event.id).catch((e) => ignoreNotFound(e, null)),
    invitationsApi.stats(event.id).catch((e) => ignoreNotFound(e, null)),
  ]);

  const inviteUrl = `${env.APP_URL}/g/${event.slug}`;

  return (
    <GuestsPageClient
      eventId={event.id}
      stats={stats}
      invitations={invitations}
      inviteUrl={inviteUrl}
    />
  );
};
