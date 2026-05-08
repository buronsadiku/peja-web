import { keepsakesApi } from "@/lib/api/keepsakes";
import { ordersApi } from "@/lib/api/orders";
import { eventsApi } from "@/lib/api/events";
import { ApiError } from "@/lib/api/client";
import { BundleBanner } from "./components/BundleBanner";
import { KeepsakesCollection } from "./components/KeepsakesCollection";
import { KeepsakesFeaturedRow } from "./components/KeepsakesFeaturedRow";
import { KeepsakesFooter } from "./components/KeepsakesFooter";
import { KeepsakesHero } from "./components/KeepsakesHero";
import { TestimonialStrip } from "./components/TestimonialStrip";

export const KeepsakesPage = async () => {
  const [catalog, ordersResult, eventsResult] = await Promise.all([
    keepsakesApi.catalog(),
    ordersApi.list({ limit: 5, orderType: "keepsake" }).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404)
        return { items: [], nextCursor: null };
      throw error;
    }),
    eventsApi.list({ limit: 1 }),
  ]);

  const eventId = eventsResult.items[0]?.id ?? null;
  const featured =
    catalog.products.find((p) => p.sku === "gold_book") ?? catalog.products[0];
  const others = catalog.products.filter((p) => p.sku !== featured?.sku);

  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
      <KeepsakesHero />
      {featured && (
        <KeepsakesFeaturedRow
          featured={featured}
          orders={ordersResult.items}
          eventId={eventId}
        />
      )}
      <BundleBanner />
      <KeepsakesCollection products={others} eventId={eventId} />

      <KeepsakesFooter />
    </div>
  );
};
