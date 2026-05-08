"use client";

type Routerish = {
  push: (href: string) => void;
};

export const startKioskOnThisDevice = async (
  router: Routerish,
  slug: string,
): Promise<void> => {
  if (typeof document !== "undefined" && !document.fullscreenElement) {
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      // ignore
    }
  }
  router.push(`/kiosk/${slug}`);
};
