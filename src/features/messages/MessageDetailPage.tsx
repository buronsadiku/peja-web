import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { eventsApi } from "@/lib/api/events";
import { messagesApi } from "@/lib/api/messages";
import { queryKeys } from "@/lib/query/keys";
import { MessageDetailPageClient } from "./MessageDetailPageClient";

type Props = { params: Promise<{ messageId: string }> };

export const MessageDetailPage = async ({ params }: Props) => {
  const { messageId } = await params;
  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0];
  if (!event) notFound();

  const detail = await messagesApi
    .get(event.id, messageId)
    .catch(() => null);
  if (!detail) notFound();

  const queryClient = new QueryClient();
  queryClient.setQueryData(
    queryKeys.messages.detail(event.id, messageId),
    detail,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MessageDetailPageClient eventId={event.id} messageId={messageId} />
    </HydrationBoundary>
  );
};
