"use client";

import { Avatar, AvatarFallback } from "@peja/ui/components/Avatar";
import { Checkbox } from "@peja/ui/components/Checkbox";
import { BookIcon } from "@peja/icons/BookIcon";
import { HeartIcon } from "@peja/icons/HeartIcon";
import { ImageIcon } from "@peja/icons/ImageIcon";
import { Waveform } from "@/features/dashboard/components/Waveform";

import type { MessageRowView } from "../adapters";
import { MessagePlayButton } from "./MessagePlayButton";
import { cn } from "@peja/ui/utils/cn";

type MessageRowProps = {
  message: MessageRowView;
  selected?: boolean;
  checked?: boolean;
  playing?: boolean;
  isCurrent?: boolean;
  progress?: number;
  currentTime?: number;
  durationOverride?: number;
  index: number;
  onClick?: () => void;
  onPlay?: () => void;
  onToggleSelect?: () => void;
};

const formatSec = (sec: number): string => {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const MessageRow = ({
  message,
  selected,
  checked = false,
  playing,
  isCurrent,
  progress = 0,
  currentTime = 0,
  durationOverride,
  index,
  onClick,
  onPlay,
  onToggleSelect,
}: MessageRowProps) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.();
      }
    }}
    className={cn(
      "border-border tablet:grid-cols-[28px_48px_1fr_100px_60px_36px] tablet:gap-4 tablet:px-6 grid w-full cursor-pointer grid-cols-[28px_48px_1fr_60px_36px] items-center gap-3 border-b px-4 py-3 text-left transition-colors",
      selected
        ? "border-l-primary bg-primary/5 border-l-3"
        : "hover:bg-muted/50 border-l-3 border-l-transparent",
    )}
  >
    <span
      className="inline-flex"
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        checked={checked}
        onChange={() => onToggleSelect?.()}
        aria-label={`Select message from ${message.name}`}
      />
    </span>

    <span className="inline-flex">
      <Avatar size="lg" className={index % 2 ? "rotate-2" : "-rotate-2"}>
        <AvatarFallback
          className="type-body-small text-primary-foreground font-semibold"
          style={{ background: message.tint }}
        >
          {message.initials}
        </AvatarFallback>
      </Avatar>
    </span>

    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className="type-body text-foreground font-semibold">
          {message.name}
        </span>
        {message.favorited && (
          <HeartIcon
            width={13}
            height={13}
            className="fill-destructive text-destructive"
          />
        )}
        {message.inGoldBook && (
          <BookIcon width={13} height={13} className="text-[#9A6B2F]" />
        )}
        {message.language && (
          <span className="rounded-4 bg-primary/10 type-caption text-primary px-1.5 py-0.5 font-bold tracking-wider uppercase">
            {message.language}
          </span>
        )}
        {message.hasPhoto && (
          <ImageIcon width={12} height={12} className="text-muted-foreground" />
        )}
      </div>
      {message.relation && (
        <p className="type-caption text-muted-foreground">{message.relation}</p>
      )}
      {(message.note || message.quote) && (
        <p className="type-body-small text-muted-foreground mt-1 truncate font-serif italic">
          &ldquo;{message.note || message.quote}&rdquo;
        </p>
      )}
    </div>

    <div
      className="tablet:block hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {message.hasAudio && (
        <Waveform
          bars={message.wave.slice(0, 24)}
          height={28}
          progress={isCurrent ? progress : 0}
        />
      )}
    </div>

    <span
      className="type-caption text-muted-foreground tablet:text-right block font-mono"
      onClick={(e) => e.stopPropagation()}
    >
      {message.hasAudio
        ? `${formatSec(isCurrent ? currentTime : 0)}/${message.duration}`
        : ""}
    </span>

    {message.hasAudio ? (
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onPlay?.();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onPlay?.();
          }
        }}
        className="inline-flex"
      >
        <MessagePlayButton playing={playing} />
      </span>
    ) : (
      <span />
    )}
  </div>
);
