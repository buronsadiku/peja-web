"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { TruckIcon } from "@peja/icons/TruckIcon";
import type { Order } from "@/lib/api/types";
import { progressFor } from "@/features/checkout/orderHelpers";
import { OrderItem } from "./OrderItem";
import { OrderDetailModal } from "./OrderDetailModal";

type OrdersRailProps = {
  orders: Order[];
};

const colorFor = (status: string): string => {
  if (status === "delivered") return "var(--secondary)";
  if (status === "shipped" || status === "in_production")
    return "var(--accent)";
  if (status === "paid" || status === "pending") return "var(--primary)";
  return "var(--muted-foreground)";
};

export const OrdersRail = ({ orders }: OrdersRailProps) => {
  const t = useTranslations();
  const [openOrder, setOpenOrder] = useState<{
    id: string;
    currency: string;
  } | null>(null);

  const productNameOf = (order: Order): string => {
    if (order.orderType === "plan") return t("keepsakes__product__order");
    return t("keepsakes__product__order");
  };

  return (
    <>
      <div className="rounded-20 border-border bg-card flex flex-col gap-3.5 border p-5">
        <div className="flex items-center gap-2">
          <TruckIcon width={16} height={16} className="text-primary" />
          <Kicker className="text-muted-foreground">
            {t("keepsakes__orders__eyebrow")}
          </Kicker>
        </div>

        {orders.length === 0 ? (
          <p className="type-body-small text-muted-foreground py-4">
            {t("keepsakes__orders__empty")}
          </p>
        ) : (
          orders.map((order) => (
            <OrderItem
              key={order.id}
              title={productNameOf(order)}
              status={t(`order__status__${order.status}`)}
              pct={progressFor(order.status)}
              color={colorFor(order.status)}
              onClick={() =>
                setOpenOrder({ id: order.id, currency: order.currency })
              }
            />
          ))
        )}
      </div>

      {openOrder && (
        <OrderDetailModal
          orderId={openOrder.id}
          currency={openOrder.currency}
          onClose={() => setOpenOrder(null)}
        />
      )}
    </>
  );
};
