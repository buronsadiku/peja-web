"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { StopIcon } from "@peja/icons/StopIcon";
import { VideoIcon } from "@peja/icons/VideoIcon";
import { useVideoRecorder } from "./useVideoRecorder";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type VideoPanelProps = {
  onCaptured: () => void;
  maxDurationSec?: number;
};

export const VideoPanel = ({ onCaptured, maxDurationSec }: VideoPanelProps) => {
  const t = useTranslations();
  const recorder = useVideoRecorder(maxDurationSec);
  const setVideo = useGuestSubmissionStore((s) => s.setVideo);
  const previewRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    recorder.attachPreview(previewRef.current);
    return () => recorder.attachPreview(null);
  }, [recorder]);

  useEffect(() => {
    if (recorder.recording) {
      setVideo({
        blob: recorder.recording.blob,
        url: recorder.recording.url,
        durationSec: recorder.recording.durationSec,
        mimeType: recorder.recording.mimeType,
      });
      onCaptured();
    }
  }, [recorder.recording, setVideo, onCaptured]);

  return (
    <div className="bg-card border-border rounded-16 flex flex-col items-center gap-3.5 border p-5">
      <video
        ref={previewRef}
        playsInline
        muted
        className="rounded-12 aspect-video w-full bg-black"
      />

      {recorder.state === "recording" ? (
        <>
          <div className="type-h2 font-semibold tabular-nums">
            {formatTime(recorder.elapsed)}
            <span className="type-body-small text-muted-foreground ml-2">
              / {formatTime(recorder.maxDurationSec)}
            </span>
          </div>
          <Button type="button" onClick={recorder.stop} className="rounded-full">
            <StopIcon width={14} height={14} />
            {t("guest__record__video__stop")}
          </Button>
        </>
      ) : (
        <Button
          type="button"
          onClick={recorder.start}
          disabled={recorder.state === "requesting"}
          className="rounded-full"
        >
          {recorder.state === "requesting" ? (
            t("guest__record__video__requesting")
          ) : (
            <>
              <VideoIcon width={14} height={14} />
              {t("guest__record__video__start")}
            </>
          )}
        </Button>
      )}

      <p className="type-caption text-muted-foreground text-center">
        {t("guest__record__video__caption", {
          seconds: recorder.maxDurationSec,
        })}
      </p>

      {recorder.error && (
        <p className="type-body-small text-destructive" role="alert">
          {recorder.error}
        </p>
      )}
    </div>
  );
};
