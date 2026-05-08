"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useInfiniteMessagesList } from "@/lib/query/messagesQueries";
import { aggregateGuests, type GuestRow } from "../adapters";

const PAGE_LIMIT = 100;

type UseGuestListResult = {
  guests: GuestRow[];
  isPending: boolean;
  isError: boolean;
  isFetchingAll: boolean;
};

export const useGuestList = (eventId: string): UseGuestListResult => {
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessagesList(eventId, {
    limit: PAGE_LIMIT,
    sort: "newest",
    includeOwnerUploads: false,
  });

  useEffect(() => {
    if (!isPending && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isPending, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const guests = useMemo(() => {
    const all = (data?.pages ?? []).flatMap((p) => p.items);
    return aggregateGuests(all, anonymous);
  }, [data?.pages, anonymous]);

  return {
    guests,
    isPending,
    isError,
    isFetchingAll: hasNextPage || isFetchingNextPage,
  };
};
