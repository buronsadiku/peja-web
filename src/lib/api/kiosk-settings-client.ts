import { clientFetch } from "./client";
import type { KioskSettings, UpdateKioskSettingsInput } from "./types";

export const kioskSettingsClient = {
  get: (eventId: string) =>
    clientFetch<{ settings: KioskSettings }>(
      `/events/${eventId}/kiosk-settings`,
    ),

  update: (eventId: string, input: UpdateKioskSettingsInput) =>
    clientFetch<{ settings: KioskSettings }>(
      `/events/${eventId}/kiosk-settings`,
      { method: "PATCH", body: input },
    ),
};
