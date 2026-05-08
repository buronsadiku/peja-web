"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMessagesList } from "@/lib/query/messagesQueries";
import type { ListMessagesQuery } from "@/lib/api/types";
import { useEventId } from "../context/MessagesEventContext";
import { useFilter } from "../store/useMessagesStore";
import { toMessageRowView } from "../adapters";

export const useMessageList = () => {
  const eventId = useEventId();
  const filter = useFilter();
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const query: ListMessagesQuery = { filter, sort: "newest", limit: 50 };
  const { data, isPending, isError } = useMessagesList(eventId, query);

  const messageViews = useMemo(
    () => (data?.items ?? []).map((m) => toMessageRowView(m, anonymous)),
    [data?.items, anonymous],
  );

  return { messageViews, isPending, isError };
};
