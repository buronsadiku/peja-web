import type { KeepsakeProduct, Order } from "@/lib/api/types";
import { decorate } from "../designTokens";
import { FeaturedProduct } from "./FeaturedProduct";
import { OrdersRail } from "./OrdersRail";

type KeepsakesFeaturedRowProps = {
  featured: KeepsakeProduct;
  orders: Order[];
  eventId: string | null;
};

export const KeepsakesFeaturedRow = ({
  featured,
  orders,
  eventId,
}: KeepsakesFeaturedRowProps) => (
  <div className="desktop:grid-cols-[1fr_320px] grid gap-5">
    <FeaturedProduct product={decorate(featured)} eventId={eventId} />
    <OrdersRail orders={orders} />
  </div>
);
