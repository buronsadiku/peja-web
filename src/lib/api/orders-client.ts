import { clientFetch } from "./client";
import type { Order, OrderDetail } from "./types";

export const ordersClient = {
  get: (orderId: string) =>
    clientFetch<{ order: OrderDetail }>(`/payments/orders/${orderId}`),

  refund: (orderId: string, input: { amountCents?: number; reason?: string }) =>
    clientFetch<{ order: Order }>(`/payments/orders/${orderId}/refund`, {
      method: "POST",
      body: input,
    }),
};
