import { apiFetch } from "./server";
import type { KioskSettings, UpdateKioskSettingsInput } from "./types";

export const kioskSettingsApi = {
  get: (eventId: string) =>
    apiFetch<{ settings: KioskSettings }>(
      `/events/${eventId}/kiosk-settings`,
    ),

  update: (eventId: string, input: UpdateKioskSettingsInput) =>
    apiFetch<{ settings: KioskSettings }>(
      `/events/${eventId}/kiosk-settings`,
      { method: "PATCH", body: input },
    ),
};
