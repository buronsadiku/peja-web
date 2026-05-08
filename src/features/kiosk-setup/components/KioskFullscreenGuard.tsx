"use client";

import { useEffect, useRef, useState } from "react";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { useRouter } from "@/i18n/navigation";
import { KioskExitDialog } from "./KioskExitDialog";

type KioskFullscreenGuardProps = {
  exitPin: string | null;
  exitHref: string;
  active: boolean;
};

export const KioskFullscreenGuard = ({
  exitPin,
  exitHref,
  active,
}: KioskFullscreenGuardProps) => {
  const router = useRouter();
  const {
    isFullscreen,
    isSupported,
    enter: enterFullscreen,
    exit: exitFullscreen,
  } = useFullscreen();
  const [open, setOpen] = useState(false);
  const wasFullscreenRef = useRef(false);
  const exitConfirmedRef = useRef(false);

  useEffect(() => {
    if (!active || !isSupported) {
      wasFullscreenRef.current = isFullscreen;
      return;
    }
    const justExited = wasFullscreenRef.current && !isFullscreen;
    wasFullscreenRef.current = isFullscreen;
    if (!justExited) return;
    if (exitConfirmedRef.current) return;
    if (exitPin) setOpen(true);
  }, [active, isSupported, isFullscreen, exitPin]);

  const handleConfirm = async () => {
    exitConfirmedRef.current = true;
    setOpen(false);
    try {
      await exitFullscreen();
    } catch {
      // ignore
    }
    router.push(exitHref);
  };

  const handleCancel = () => {
    setOpen(false);
    if (active && !isFullscreen) {
      enterFullscreen();
    }
  };

  return (
    <KioskExitDialog
      open={open}
      expectedPin={exitPin}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    />
  );
};
