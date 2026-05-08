import type { OrderStatus } from "@/lib/api/types";

const STATUS_PROGRESS: Record<string, number> = {
  pending: 10,
  paid: 25,
  in_production: 60,
  shipped: 85,
  delivered: 100,
  failed: 0,
  refunded: 0,
  cancelled: 0,
};

const STATUS_TONE: Record<
  string,
  "primary" | "secondary" | "destructive" | "muted"
> = {
  pending: "muted",
  paid: "primary",
  in_production: "primary",
  shipped: "secondary",
  delivered: "secondary",
  failed: "destructive",
  refunded: "muted",
  cancelled: "muted",
};

export const statusKey = (status: OrderStatus): string =>
  `order__status__${status}`;

export const labelFor = (status: OrderStatus): string => statusKey(status);

export const progressFor = (status: OrderStatus): number =>
  STATUS_PROGRESS[status] ?? 0;

export const toneFor = (
  status: OrderStatus,
): "primary" | "secondary" | "destructive" | "muted" =>
  STATUS_TONE[status] ?? "muted";

export const formatPrice = (priceCents: number, currency: string): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(priceCents / 100);
  } catch {
    return `${(priceCents / 100).toFixed(2)} ${currency}`;
  }
};

export const formatOrderDate = (raw: string): string => {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
