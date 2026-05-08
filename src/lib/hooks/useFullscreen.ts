"use client";

import { useCallback, useSyncExternalStore } from "react";

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

const getFullscreenElement = (): Element | null => {
  if (typeof document === "undefined") return null;
  const d = document as FullscreenDocument;
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
};

const subscribeFullscreen = (callback: () => void) => {
  document.addEventListener("fullscreenchange", callback);
  document.addEventListener("webkitfullscreenchange", callback);
  return () => {
    document.removeEventListener("fullscreenchange", callback);
    document.removeEventListener("webkitfullscreenchange", callback);
  };
};

const getFullscreenSnapshot = () => Boolean(getFullscreenElement());
const getFullscreenServerSnapshot = () => false;

const subscribeNoop = () => () => {};
const getSupportedSnapshot = () =>
  Boolean(
    document.documentElement.requestFullscreen ||
    (document.documentElement as FullscreenElement).webkitRequestFullscreen,
  );
const getSupportedServerSnapshot = () => false;

export const useFullscreen = (): {
  isFullscreen: boolean;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
  isSupported: boolean;
} => {
  const isFullscreen = useSyncExternalStore(
    subscribeFullscreen,
    getFullscreenSnapshot,
    getFullscreenServerSnapshot,
  );
  const isSupported = useSyncExternalStore(
    subscribeNoop,
    getSupportedSnapshot,
    getSupportedServerSnapshot,
  );

  const enter = useCallback(async () => {
    if (typeof document === "undefined") return;
    const el = document.documentElement as FullscreenElement;
    if (el.requestFullscreen) {
      await el.requestFullscreen().catch(() => undefined);
    } else if (el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen().catch(() => undefined);
    }
  }, []);

  const exit = useCallback(async () => {
    if (typeof document === "undefined") return;
    const d = document as FullscreenDocument;
    if (d.exitFullscreen) {
      await d.exitFullscreen().catch(() => undefined);
    } else if (d.webkitExitFullscreen) {
      await d.webkitExitFullscreen().catch(() => undefined);
    }
  }, []);

  return { isFullscreen, enter, exit, isSupported };
};
