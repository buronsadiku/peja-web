"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { kioskSettingsClient } from "@/lib/api/kiosk-settings-client";
import type {
  KioskSettings,
  UpdateKioskSettingsInput,
} from "@/lib/api/types";

const DEBOUNCE_MS = 400;

type UseKioskSettingsResult = {
  settings: KioskSettings;
  patch: (changes: UpdateKioskSettingsInput) => void;
  isSaving: boolean;
  error: Error | null;
};

export const useKioskSettings = (
  eventId: string,
  initial: KioskSettings,
): UseKioskSettingsResult => {
  const [settings, setSettings] = useState<KioskSettings>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const pendingRef = useRef<UpdateKioskSettingsInput>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    const payload = pendingRef.current;
    if (!Object.keys(payload).length) return;
    pendingRef.current = {};
    setIsSaving(true);
    setError(null);
    try {
      const res = await kioskSettingsClient.update(eventId, payload);
      setSettings(res.settings);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to save"));
    } finally {
      setIsSaving(false);
    }
  }, [eventId]);

  const patch = useCallback(
    (changes: UpdateKioskSettingsInput) => {
      setSettings((prev) => ({ ...prev, ...changes }));
      pendingRef.current = { ...pendingRef.current, ...changes };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        flush();
      }, DEBOUNCE_MS);
    },
    [flush],
  );

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return { settings, patch, isSaving, error };
};
