import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { messagesApi } from "@/lib/api/messages";
import { queryKeys } from "@/lib/query/keys";
import { PhotosEmptyState } from "./components/PhotosEmptyState";
import { PhotosPageClient } from "./PhotosPageClient";

export const PhotosPage = async () => {
  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0];
  if (!event) return <PhotosEmptyState />;

  const initialQuery = {
    filter: "with_photo",
    sort: "newest",
    limit: 20,
    includeOwnerUploads: true,
  } as const;

  const [initialMessages, stats] = await Promise.all([
    messagesApi.list(event.id, initialQuery),
    eventsApi.stats(event.id).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
  ]);

  const queryClient = new QueryClient();
  queryClient.setQueryData(
    queryKeys.messages.infiniteList(event.id, initialQuery),
    {
      pages: [initialMessages],
      pageParams: [null],
    },
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PhotosPageClient eventId={event.id} stats={stats} />
    </HydrationBoundary>
  );
};
