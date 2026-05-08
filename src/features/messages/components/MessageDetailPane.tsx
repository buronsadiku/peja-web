"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Kicker } from "@peja/ui/components/Kicker";
import { DownloadIcon } from "@peja/icons/DownloadIcon";
import { HeartIcon } from "@peja/icons/HeartIcon";
import { PauseIcon } from "@peja/icons/PauseIcon";
import { PlayIcon } from "@peja/icons/PlayIcon";
import { StarIcon } from "@peja/icons/StarIcon";
import { Waveform } from "@/features/dashboard/components/Waveform";
import {
  useMessageDetail,
  useRetranscribeMessage,
} from "@/lib/query/messagesQueries";
import { downloadMessageAssets } from "@/lib/media/downloadMessageAssets";
import { formatTimeShort } from "../adapters";

import {
  MediaPlayer,
  MediaProvider,
  isHTMLVideoElement,
  type MediaLoadedMetadataEvent,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import Image from "next/image";
import type { MessageRowView } from "../adapters";

type MessageDetailPaneProps = {
  eventId: string;
  message: MessageRowView | null;
  onToggleFavorite: () => void;
  onToggleGoldBook?: () => void;
  togglePending: boolean;
  isPlayingActive?: boolean;
  isCurrentTrack?: boolean;
  progress?: number;
  currentTime?: number;
  playerDuration?: number;
  onTogglePlay?: () => void;
  onSeek?: (ratio: number) => void;
  fullScreen?: boolean;
};

const formatSec = (sec: number): string => {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const MessageDetailPane = ({
  eventId,
  message,
  onToggleFavorite,
  onToggleGoldBook,
  togglePending,
  isPlayingActive = false,
  progress = 0,
  currentTime = 0,
  onTogglePlay,
  onSeek,
  fullScreen = false,
}: MessageDetailPaneProps) => {
  const t = useTranslations();
  const { data: detail } = useMessageDetail(eventId, message?.id ?? null);
  const retranscribe = useRetranscribeMessage(eventId);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!detail?.message || !message) return;
    setDownloading(true);
    try {
      const photoItem = detail.message.media.find((m) => m.type === "photo");
      const videoItem = detail.message.media.find((m) => m.type === "video");
      await downloadMessageAssets({
        guestName: message.name,
        audioUrl: detail.message.audioUrl,
        videoUrl: videoItem?.url ?? null,
        photoUrl: photoItem?.url ?? null,
        writtenNote: detail.message.writtenNote,
      });
    } catch (err) {
      console.error("[download] failed", err);
    } finally {
      setDownloading(false);
    }
  };

  const containerVisibility = fullScreen
    ? "flex"
    : "small-desktop:flex hidden border-l border-border";

  if (!message) {
    return (
      <div
        className={`bg-background ${containerVisibility} max-w-80 flex-col items-center justify-center gap-2 overflow-auto p-8 text-center`}
      >
        <Kicker className="text-muted-foreground">
          {t("messages__detail__placeholder_eyebrow")}
        </Kicker>
        <p className="type-body-small text-muted-foreground">
          {t("messages__detail__placeholder_body")}
        </p>
      </div>
    );
  }

  const audioUrl = detail?.message.audioUrl ?? null;
  const mediaItems = detail?.message.media ?? [];
  const firstVideo = mediaItems.find((m) => m.type === "video");
  const firstPhoto = mediaItems.find((m) => m.type === "photo");
  const videoUrl = firstVideo?.url ?? null;
  const videoMimeType = "video/mp4";
  const photoUrl = firstPhoto?.url ?? null;
  const writtenNote = detail?.message.writtenNote ?? null;
  const hasAudio = Boolean(audioUrl);
  const hasNote = Boolean(writtenNote && writtenNote.trim());
  const hasMedia = mediaItems.length > 0;
  const transcript =
    detail?.message.transcript ??
    message.quote ??
    t("messages__detail__transcript_unavailable");
  const fullDuration = message.duration;
  const recordedAt = formatTimeShort(message.createdAt);

  return (
    <div
      className={`bg-background ${containerVisibility} flex-col gap-4 overflow-auto p-5`}
    >
      <div className="rounded-16 border-border bg-card flex gap-3.5 border p-5">
        <div
          className="flex size-18 shrink-0 -rotate-3 items-center justify-center rounded-full font-serif text-3xl font-bold"
          style={{
            background: message.tint,
            color: "#5a3b20",
          }}
        >
          {message.initials}
        </div>
        <div className="min-w-0 flex-1">
          {message.relation && (
            <Kicker className="text-primary">{message.relation}</Kicker>
          )}
          <p className="type-h4 mt-1 leading-snug font-semibold">
            {message.name}
          </p>
          <p className="type-caption text-muted-foreground mt-1">
            {recordedAt} &middot; {fullDuration}
          </p>
        </div>
      </div>

      {hasAudio && (
        <div className="rounded-16 bg-foreground text-background relative min-h-fit overflow-hidden p-4.5">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(200px 120px at 80% 50%, oklch(0.705 0.120 262.5 / 0.2), transparent 70%)",
            }}
          />
          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={onTogglePlay}
              className="bg-destructive text-primary-foreground flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-none shadow-[0_0_0_6px_oklch(0.723_0.135_40/0.15)]"
            >
              {isPlayingActive ? (
                <PauseIcon width={14} height={14} />
              ) : (
                <PlayIcon width={14} height={14} />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={1}
                aria-valuenow={progress}
                tabIndex={0}
                onPointerDown={(e) => {
                  if (!onSeek) return;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  const rect = e.currentTarget.getBoundingClientRect();
                  onSeek((e.clientX - rect.left) / rect.width);
                }}
                onPointerMove={(e) => {
                  if (!onSeek) return;
                  if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  onSeek((e.clientX - rect.left) / rect.width);
                }}
                onKeyDown={(e) => {
                  if (!onSeek) return;
                  if (e.key === "ArrowLeft")
                    onSeek(Math.max(0, progress - 0.05));
                  if (e.key === "ArrowRight")
                    onSeek(Math.min(1, progress + 0.05));
                }}
                className="cursor-pointer touch-none select-none"
              >
                <Waveform bars={message.wave} height={40} progress={progress} />
              </div>
              <div className="type-caption mt-1.5 flex justify-between font-mono opacity-70">
                <span>{formatSec(currentTime)}</span>
                <span>{fullDuration}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasMedia && (
        <div className="rounded-16 border-border bg-card border p-4.5">
          <Kicker className="text-muted-foreground mb-3">
            {t("messages__detail__media_eyebrow")}
          </Kicker>
          <div className="grid grid-cols-2 gap-2">
            {photoUrl && (
              <a
                href={photoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-12 bg-muted relative block aspect-square overflow-hidden"
              >
                <Image
                  src={photoUrl}
                  fill
                  unoptimized
                  className="object-cover"
                  alt={message.name}
                />
              </a>
            )}
            {videoUrl && (
              <div className="rounded-12 bg-muted block aspect-square size-full h-40 w-40 overflow-hidden">
                <MediaPlayer
                  src={[
                    {
                      src: videoUrl,
                      type: videoMimeType as "video/mp4" | "video/webm",
                    },
                  ]}
                  viewType="video"
                  streamType="on-demand"
                  load="visible"
                  preload="none"
                  onLoadedMetadata={(nativeEvent: MediaLoadedMetadataEvent) => {
                    const el = nativeEvent.trigger?.target;
                    if (!isHTMLVideoElement(el)) return;
                    if (Number.isFinite(el.duration) && el.duration > 0) return;
                    const onSeeked = () => {
                      el.removeEventListener("seeked", onSeeked);
                      try {
                        el.currentTime = 0;
                      } catch {
                        /* noop */
                      }
                    };
                    el.addEventListener("seeked", onSeeked);
                    try {
                      el.currentTime = Number.MAX_SAFE_INTEGER;
                    } catch {
                      el.removeEventListener("seeked", onSeeked);
                    }
                  }}
                  onError={(detail) => {
                    console.error("[video] vidstack error", detail);
                  }}
                  className="size-full"
                >
                  <MediaProvider />
                  <DefaultVideoLayout icons={defaultLayoutIcons} />
                </MediaPlayer>
              </div>
            )}
          </div>
        </div>
      )}

      {hasNote && (
        <div className="rounded-16 border-border bg-card border p-4.5">
          <Kicker className="text-muted-foreground">
            {t("messages__detail__note_eyebrow")}
          </Kicker>
          <p className="type-body-small text-foreground mt-2 leading-relaxed whitespace-pre-wrap">
            {writtenNote}
          </p>
        </div>
      )}

      {hasAudio && message.quote && (
        <div className="rounded-8 border-l-3 border-l-[oklch(0.65_0.12_65)] bg-[oklch(0.65_0.12_65/0.1)] px-5 py-4">
          <Kicker className="text-[#9A6B2F]">
            {t("messages__detail__pulled_quote")}
          </Kicker>
          <p className="type-body-large text-foreground mt-2 font-serif leading-relaxed italic">
            &ldquo;{message.quote}&rdquo;
          </p>
        </div>
      )}

      {hasAudio && (
        <div className="rounded-16 border-border bg-card border p-4.5">
          <div className="mb-2 flex items-center justify-between">
            <Kicker className="text-muted-foreground">
              {t("messages__detail__transcript_eyebrow")}
            </Kicker>
            {detail?.message.transcriptStatus && (
              <span className="type-caption text-muted-foreground capitalize">
                {detail.message.transcriptStatus}
              </span>
            )}
          </div>
          <p className="type-body-small text-foreground leading-relaxed">
            {transcript}
          </p>
          <button
            type="button"
            onClick={() => retranscribe.mutate({ messageId: message.id })}
            disabled={retranscribe.isPending}
            className="type-caption text-primary mt-3 cursor-pointer font-semibold disabled:opacity-50"
          >
            {retranscribe.isPending
              ? t("messages__detail__retranscribe_pending")
              : t("messages__detail__retranscribe")}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button
          className="rounded-12"
          variant={message.inGoldBook ? "secondary" : "default"}
          onClick={onToggleGoldBook}
          disabled={togglePending}
        >
          {message.inGoldBook
            ? t("messages__detail__in_book")
            : t("messages__detail__add_to_book")}
        </Button>
        <Button
          variant="outline"
          className="rounded-12"
          onClick={handleDownload}
          disabled={downloading || !detail?.message}
        >
          <DownloadIcon width={14} height={14} /> {t("messages__detail__download")}
        </Button>
        <Button
          variant="outline"
          className="rounded-12"
          onClick={onToggleFavorite}
          disabled={togglePending}
        >
          <HeartIcon
            width={14}
            height={14}
            className={
              message.favorited ? "fill-destructive text-destructive" : ""
            }
          />
          {message.favorited
            ? t("messages__detail__favourited")
            : t("messages__detail__favourite")}
        </Button>
        <Button variant="outline" className="rounded-12">
          {t("messages__detail__reply")}
        </Button>
      </div>

      {message.listens > 0 && (
        <div className="type-caption text-muted-foreground flex items-center gap-2">
          <PlayIcon width={10} height={10} />
          <span>
            {t("messages__detail__played_times", { count: message.listens })}
          </span>
          {message.favorited && (
            <>
              <span>&middot;</span>
              <StarIcon
                width={11}
                height={11}
                className="fill-[#9A6B2F] text-[#9A6B2F]"
              />
              <span>{t("messages__detail__book_worthy")}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
