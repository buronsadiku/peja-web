"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { VideoIcon } from "@peja/icons/VideoIcon";
import { PlusIcon } from "@peja/icons/PlusIcon";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { CaptureCardHeader } from "./CaptureCardHeader";
import { VideoPanel } from "./VideoPanel";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type VideoCaptureCardProps = {
  maxDurationSec?: number;
};

export const VideoCaptureCard = ({ maxDurationSec }: VideoCaptureCardProps = {}) => {
  const t = useTranslations();
  const video = useGuestSubmissionStore((s) => s.video);
  const setVideo = useGuestSubmissionStore((s) => s.setVideo);
  const [editing, setEditing] = useState(false);

  const open = editing && !video;

  return (
    <div className="bg-card/65 border-border rounded-16 flex flex-col gap-4 border p-4 backdrop-blur-sm">
      <CaptureCardHeader
        icon={<VideoIcon width={18} height={18} />}
        iconClassName="bg-destructive"
        title={t("guest__compose__video_title")}
        meta={
          video
            ? t("guest__compose__video_captured", {
                duration: formatTime(video.durationSec),
              })
            : t("guest__compose__video_subtitle", {
                seconds: maxDurationSec ?? 60,
              })
        }
        filled={Boolean(video)}
      />

      {video && !open && (
        <>
          <video
            src={video.url}
            controls
            playsInline
            className="rounded-12 aspect-video w-full bg-black"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setVideo(null);
                setEditing(true);
              }}
            >
              {t("guest__record__video__re_record")}
            </Button>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => setVideo(null)}
            >
              {t("guest__compose__remove")}
            </Button>
          </div>
        </>
      )}

      {open && (
        <VideoPanel
          onCaptured={() => setEditing(false)}
          maxDurationSec={maxDurationSec}
        />
      )}

      {!video && !editing && (
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={() => setEditing(true)}
        >
          <PlusIcon width={14} height={14} />
          {t("guest__compose__add_video")}
        </Button>
      )}
    </div>
  );
};
