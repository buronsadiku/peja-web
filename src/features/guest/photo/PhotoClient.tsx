"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { CameraIcon } from "@peja/icons/CameraIcon";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { Link } from "@/i18n/navigation";
import { WizardHeader } from "../shell/WizardHeader";
import { StickyCTA } from "../shell/StickyCTA";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { KioskFullscreenGuard } from "@/features/kiosk-setup/components/KioskFullscreenGuard";

const MAX_BYTES = 25 * 1024 * 1024;

type PhotoClientProps = {
  slug: string;
  exitPin: string | null;
  fullscreenLock: boolean;
  sourceParam: string | null;
};

export const PhotoClient = ({
  slug,
  exitPin,
  fullscreenLock,
  sourceParam,
}: PhotoClientProps) => {
  const isKioskSession = sourceParam === "kiosk";
  const t = useTranslations();
  const photo = useGuestSubmissionStore((s) => s.photo);
  const setPhoto = useGuestSubmissionStore((s) => s.setPhoto);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photo?.url) URL.revokeObjectURL(photo.url);
    };
  }, [photo?.url]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(t("guest__record__photo__error_not_image"));
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(t("guest__record__photo__error_too_large"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPhoto({
        file,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setError(null);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError(t("guest__record__photo__error_open"));
    };
    img.src = url;
  };

  const continueHref = `/g/${slug}/review${isKioskSession ? "?source=kiosk" : ""}`;

  return (
    <div className="flex flex-1 flex-col">
      <KioskFullscreenGuard
        active={isKioskSession && fullscreenLock}
        exitPin={exitPin}
        exitHref="/app/kiosk"
      />
      <div className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-9 tablet:px-8 small-desktop:px-10 small-desktop:py-9">
        <WizardHeader
          backHref={`/g/${slug}/compose${isKioskSession ? "?source=kiosk" : ""}`}
          step={2}
          totalSteps={3}
          title={t("guest__photo__title")}
          subtitle={t("guest__photo__subtitle")}
        />
        <div className="bg-card border-border rounded-16 flex flex-col items-center gap-4_5 border p-6_5 text-center">
          {photo ? (
            <>
              <img
                src={photo.url}
                alt=""
                className="rounded-12 max-h-100 w-full object-contain"
              />
              <p className="type-caption text-muted-foreground">
                {t("guest__record__photo__dimensions", {
                  width: photo.width,
                  height: photo.height,
                  size: (photo.file.size / (1024 * 1024)).toFixed(1),
                })}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => inputRef.current?.click()}
                >
                  {t("guest__record__photo__choose_another")}
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setPhoto(null)}
                >
                  {t("guest__compose__remove")}
                </Button>
              </div>
            </>
          ) : (
            <>
              <CameraIcon width={28} height={28} className="text-primary" />
              <p className="type-body-small text-muted-foreground max-w-sm">
                {t("guest__photo__caption")}
              </p>
              <Button
                size="lg"
                className="rounded-full"
                onClick={() => inputRef.current?.click()}
              >
                <CameraIcon width={16} height={16} />
                {t("guest__record__photo__choose")}
              </Button>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          {error && (
            <p className="type-body-small text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
      <StickyCTA>
        <div className="flex flex-col gap-2">
          <Button asChild size="lg" className="w-full rounded-full shadow-lg">
            <Link href={continueHref}>
              {photo
                ? t("guest__wizard__continue")
                : t("guest__photo__skip_continue")}
              <ArrowRightIcon width={16} height={16} />
            </Link>
          </Button>
        </div>
      </StickyCTA>
    </div>
  );
};
