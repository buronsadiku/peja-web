"use client";

import { useCallback } from "react";
import { PlayIcon } from "@peja/icons/PlayIcon";
import { PauseIcon } from "@peja/icons/PauseIcon";
import { cn } from "../utils/cn";
import { AudioPlayer } from "./AudioPlayer";
import { Waveform } from "./Waveform";
import { useAudioPlayer, type TAudioPlayer } from "../hooks/useAudioPlayer";

type AudioWavePlayerProps = {
  src: string;
  id?: string;
  player?: TAudioPlayer;
  bars?: number[];
  barCount?: number;
  height?: number;
  className?: string;
  wave?: boolean;
};

const useOwnPlayer = (src: string) => {
  const resolveSrc = useCallback(async () => src, [src]);
  return useAudioPlayer({ resolveSrc });
};

export const AudioWavePlayer = ({
  src,
  id = "audio",
  player: externalPlayer,
  bars,
  barCount,
  height,
  className,
  wave = false,
}: AudioWavePlayerProps) => {
  const ownPlayer = useOwnPlayer(src);
  const player = externalPlayer ?? ownPlayer;
  const isPlaying = player.playingId === id && player.isPlaying;
  const progress = player.playingId === id ? player.progress : 0;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        onClick={() => player.toggle(id)}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-9 shrink-0 items-center justify-center rounded-full shadow-md transition"
      >
        {isPlaying ? (
          <PauseIcon width={13} height={13} />
        ) : (
          <PlayIcon width={13} height={13} />
        )}
      </button>
      {wave && (
        <Waveform
          bars={bars}
          barCount={barCount}
          height={height}
          progress={progress}
          className="flex-1"
        />
      )}
      {!externalPlayer && <AudioPlayer player={ownPlayer} />}
    </div>
  );
};
