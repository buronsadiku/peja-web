"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { MicIcon } from "@peja/icons/MicIcon";
import { PlusIcon } from "@peja/icons/PlusIcon";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { CaptureCardHeader } from "./CaptureCardHeader";
import { VoicePanel } from "./VoicePanel";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type VoiceCaptureCardProps = {
  maxDurationSec?: number;
};

export const VoiceCaptureCard = ({ maxDurationSec }: VoiceCaptureCardProps = {}) => {
  const t = useTranslations();
  const audio = useGuestSubmissionStore((s) => s.audio);
  const setAudio = useGuestSubmissionStore((s) => s.setAudio);
  const [editing, setEditing] = useState(false);

  const open = editing && !audio;

  return (
    <div className="bg-card/65 border-border rounded-16 flex flex-col gap-4 border p-4 backdrop-blur-sm">
      <CaptureCardHeader
        icon={<MicIcon width={18} height={18} />}
        iconClassName="bg-primary"
        title={t("guest__compose__voice_title")}
        meta={
          audio
            ? t("guest__compose__voice_captured", {
                duration: formatTime(audio.durationSec),
              })
            : t("guest__compose__voice_subtitle", {
                seconds: maxDurationSec ?? 180,
              })
        }
        filled={Boolean(audio)}
      />

      {audio && !open && (
        <>
          <audio src={audio.url} controls className="w-full" />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setAudio(null);
                setEditing(true);
              }}
            >
              {t("guest__record__audio__re_record")}
            </Button>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => setAudio(null)}
            >
              {t("guest__compose__remove")}
            </Button>
          </div>
        </>
      )}

      {open && (
        <VoicePanel
          onCaptured={() => setEditing(false)}
          maxDurationSec={maxDurationSec}
        />
      )}

      {!audio && !editing && (
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={() => setEditing(true)}
        >
          <PlusIcon width={14} height={14} />
          {t("guest__compose__add_voice")}
        </Button>
      )}
    </div>
  );
};
