"use client";

import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerProps,
} from "@vidstack/react";
import type { TAudioPlayer } from "../hooks/useAudioPlayer";

type AudioPlayerProps = {
  player: TAudioPlayer;
  className?: string;
};

const buildSrc = (src: string | null): MediaPlayerProps["src"] =>
  src ? [{ src, type: "audio/mpeg" }] : "";

export const AudioPlayer = ({ player, className }: AudioPlayerProps) => {
  if (!player) return null;

  return (
    <MediaPlayer
      ref={player.playerRef}
      src={buildSrc(player.src)}
      viewType="audio"
      streamType="on-demand"
      load="eager"
      preload="auto"
      onTimeUpdate={player.onTimeUpdate}
      onDurationChange={player.onDurationChange}
      onPlay={player.onPlay}
      onPause={player.onPause}
      onError={(detail) => {
        console.error("[audio] vidstack error", detail);
      }}
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
      className={className}
    >
      <MediaProvider />
    </MediaPlayer>
  );
};
