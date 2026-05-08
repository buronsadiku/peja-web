import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { publicApi } from "@/lib/api/public";
import { kioskSettingsApi } from "@/lib/api/kiosk-settings";
import { KioskHero } from "./components/KioskHero";
import { KioskChecklist } from "./components/KioskChecklist";
import { KioskFooter } from "./components/KioskFooter";
import { KioskSetupClient } from "./KioskSetupClient";

export const KioskSetupPage = async () => {
  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0] ?? null;

  if (!event) {
    return (
      <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
        <KioskHero slug={null} />
        <KioskChecklist />
        <KioskFooter slug={null} />
      </div>
    );
  }

  const [publicEvent, settingsRes] = await Promise.all([
    publicApi.getEvent(event.slug).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    kioskSettingsApi.get(event.id),
  ]);

  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
      <KioskSetupClient
        eventId={event.id}
        slug={event.slug}
        settings={settingsRes.settings}
        publicEvent={publicEvent}
      />
    </div>
  );
};
