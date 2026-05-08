"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { MicIcon } from "@peja/icons/MicIcon";
import { StopIcon } from "@peja/icons/StopIcon";
import { useAudioRecorder } from "./useAudioRecorder";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type VoicePanelProps = {
  onCaptured: () => void;
  maxDurationSec?: number;
};

export const VoicePanel = ({ onCaptured, maxDurationSec }: VoicePanelProps) => {
  const t = useTranslations();
  const recorder = useAudioRecorder(maxDurationSec);
  const setAudio = useGuestSubmissionStore((s) => s.setAudio);

  useEffect(() => {
    if (recorder.recording) {
      setAudio({
        blob: recorder.recording.blob,
        url: recorder.recording.url,
        durationSec: recorder.recording.durationSec,
        mimeType: recorder.recording.mimeType,
      });
      onCaptured();
    }
  }, [recorder.recording, setAudio, onCaptured]);

  return (
    <div className="bg-card border-border rounded-16 flex flex-col items-center gap-4_5 border p-6_5 text-center">
      <p className="type-body-small text-muted-foreground max-w-sm">
        {t("guest__record__audio__hint", {
          seconds: recorder.maxDurationSec,
        })}
      </p>

      {recorder.state === "recording" ? (
        <>
          <div className="type-h1 font-semibold tabular-nums">
            {formatTime(recorder.elapsed)}
            <span className="type-body-small text-muted-foreground ml-2">
              / {formatTime(recorder.maxDurationSec)}
            </span>
          </div>
          <Button
            type="button"
            onClick={recorder.stop}
            size="lg"
            className="rounded-full"
          >
            <StopIcon width={16} height={16} />
            {t("guest__record__audio__stop")}
          </Button>
        </>
      ) : (
        <Button
          type="button"
          onClick={recorder.start}
          size="lg"
          disabled={recorder.state === "requesting"}
          className="rounded-full"
        >
          {recorder.state === "requesting" ? (
            t("guest__record__audio__requesting")
          ) : (
            <>
              <MicIcon width={16} height={16} />
              {t("guest__record__audio__start")}
            </>
          )}
        </Button>
      )}

      {recorder.error && (
        <p className="type-body-small text-destructive" role="alert">
          {recorder.error}
        </p>
      )}
    </div>
  );
};
