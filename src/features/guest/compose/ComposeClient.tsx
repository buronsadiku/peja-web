"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { Link } from "@/i18n/navigation";
import { WizardHeader } from "../shell/WizardHeader";
import { StickyCTA } from "../shell/StickyCTA";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { KioskFullscreenGuard } from "@/features/kiosk-setup/components/KioskFullscreenGuard";
import { VoiceCaptureCard } from "./VoiceCaptureCard";
import { VideoCaptureCard } from "./VideoCaptureCard";
import { NoteCaptureCard } from "./NoteCaptureCard";

type ComposeClientProps = {
  slug: string;
  captureAudio: boolean;
  captureVideo: boolean;
  capturePhoto: boolean;
  maxDurationSec: number;
  exitPin: string | null;
  fullscreenLock: boolean;
  sourceParam: string | null;
};

export const ComposeClient = ({
  slug,
  captureAudio,
  captureVideo,
  capturePhoto,
  maxDurationSec,
  exitPin,
  fullscreenLock,
  sourceParam,
}: ComposeClientProps) => {
  const t = useTranslations();
  const isKioskSession = sourceParam === "kiosk";
  const setSlug = useGuestSubmissionStore((s) => s.setSlug);

  useEffect(() => {
    setSlug(slug);
  }, [slug, setSlug]);

  const totalSteps = capturePhoto ? 3 : 2;
  const sourceQuery = isKioskSession ? "?source=kiosk" : "";
  const nextHref = capturePhoto
    ? `/g/${slug}/photo${sourceQuery}`
    : `/g/${slug}/review${sourceQuery}`;
  const backHref = isKioskSession ? `/kiosk/${slug}` : `/g/${slug}`;

  return (
    <div className="flex flex-1 flex-col">
      <KioskFullscreenGuard
        active={isKioskSession && fullscreenLock}
        exitPin={exitPin}
        exitHref="/app/kiosk"
      />
      <div className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-9 tablet:px-8 small-desktop:px-10 small-desktop:py-9">
        <WizardHeader
          backHref={backHref}
          step={1}
          totalSteps={totalSteps}
          title={t("guest__compose__title")}
          subtitle={t("guest__compose__subtitle")}
        />
        <div className="flex flex-col gap-3.5">
          {captureAudio && (
            <VoiceCaptureCard maxDurationSec={maxDurationSec} />
          )}
          {captureVideo && (
            <VideoCaptureCard maxDurationSec={maxDurationSec} />
          )}
          <NoteCaptureCard />
        </div>
      </div>
      <StickyCTA caption={t("guest__compose__caption")}>
        <Button asChild size="lg" className="w-full rounded-full shadow-lg">
          <Link href={nextHref}>
            {t("guest__wizard__continue")}
            <ArrowRightIcon width={16} height={16} />
          </Link>
        </Button>
      </StickyCTA>
    </div>
  );
};
