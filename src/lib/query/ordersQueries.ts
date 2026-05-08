"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersClient } from "@/lib/api/orders-client";
import { queryKeys } from "./keys";

export const useOrderDetail = (orderId: string | null) =>
  useQuery({
    queryKey: queryKeys.orders.detail(orderId ?? ""),
    queryFn: () => ordersClient.get(orderId!),
    enabled: Boolean(orderId),
  });

export const useRefundOrder = (orderId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { amountCents?: number; reason?: string }) =>
      ordersClient.refund(orderId, input),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.all() });
      qc.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    },
  });
};
