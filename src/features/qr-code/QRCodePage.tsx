import { eventsApi } from "@/lib/api/events";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { ApiError } from "@/lib/api/client";
import { ActivateLinkBanner } from "@/features/activate-link";
import { LinkToggleCard } from "./components/LinkToggleCard";
import { OrderCtaStrip } from "./components/OrderCtaStrip";
import { QRCodeDesktopFooter } from "./components/QRCodeDesktopFooter";
import { QRCodeHeader } from "./components/QRCodeHeader";
import { QRCodeMobileBar } from "./components/QRCodeMobileBar";
import { QRCodeStudio } from "./components/QRCodeStudio";
import { QRStatsCard } from "./components/QRStatsCard";
import { QRCodeEmpty } from "./components/QRCodeEmpty";

const coupleNameOf = (partnerA: string, partnerB: string) =>
  [partnerA, partnerB].filter(Boolean).join(" & ");

export const QRCodePage = async () => {
  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0];
  if (!event)
    return (
      <div className="flex h-full w-full flex-1 flex-col overflow-y-auto p-6">
        <QRCodeEmpty />
      </div>
    );

  const [qr, subResult, stats] = await Promise.all([
    eventsApi
      .qrCode(event.id, { format: "svg", size: 512 })
      .catch((error) => {
        if (ApiError.isApiError(error) && error.status === 404) return null;
        throw error;
      }),
    subscriptionsApi.get(event.id).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    eventsApi.stats(event.id).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
  ]);

  const subscription = subResult?.subscription ?? null;
  const showActivation = !subscription;

  return (
    <div className="mx-auto h-full w-full min-w-0 flex-1 overflow-y-auto p-6">
      <QRCodeHeader guestSlug={event.slug} />
      {showActivation && (
        <div className="mt-6">
          <ActivateLinkBanner />
        </div>
      )}
      {subscription && (
        <div className="mt-6">
          <LinkToggleCard
            eventId={event.id}
            enabled={event.status === "active"}
          />
        </div>
      )}
      <div className="mt-6">
        <QRCodeStudio
          coupleName={coupleNameOf(event.partnerAName, event.partnerBName)}
          slug={event.slug}
          shortUrl={qr?.shortUrl ?? `/g/${event.slug}`}
        />
      </div>
      <div className="mt-4">
        <QRStatsCard
          totalMessages={stats?.totalMessages ?? 0}
          photoCount={stats?.photoCount ?? 0}
          videoCount={stats?.videoCount ?? 0}
          audioMessages={stats?.audioMessages ?? 0}
        />
      </div>
      <div className="mt-4">
        <OrderCtaStrip />
      </div>
      <QRCodeDesktopFooter />
      <QRCodeMobileBar />
    </div>
  );
};
