import { apiFetch, apiFetchPaginated } from "./server";
import type { Order, OrderDetail } from "./types";

export const ordersApi = {
  list: (
    query: {
      eventId?: string;
      orderType?: "plan" | "keepsake";
      cursor?: string;
      limit?: number;
    } = {},
  ) => apiFetchPaginated<Order>("/payments/orders", { query }),

  get: (orderId: string) =>
    apiFetch<{ order: OrderDetail }>(`/payments/orders/${orderId}`),
};
