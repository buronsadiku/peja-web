"use client";

import { useCallback, useRef, useState } from "react";
import type {
  MediaPlayerInstance,
  MediaTimeUpdateEventDetail,
} from "@vidstack/react";

type UseAudioPlayerOptions = {
  resolveSrc: (id: string) => Promise<string | null>;
};

export type TAudioPlayer = {
  playerRef: React.RefObject<MediaPlayerInstance | null>;
  src: string | null;
  playingId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  toggle: (id: string) => Promise<void>;
  seekRatio: (ratio: number) => void;
  onTimeUpdate: (detail: MediaTimeUpdateEventDetail) => void;
  onDurationChange: (duration: number) => void;
  onPlay: () => void;
  onPause: () => void;
};

const waitForCanPlay = (player: MediaPlayerInstance) =>
  new Promise<void>((resolve) => {
    let alreadyReady = false;
    try {
      alreadyReady = Boolean(player.state?.canPlay);
    } catch {
      alreadyReady = false;
    }
    if (alreadyReady) {
      resolve();
      return;
    }
    const off = player.listen("can-play", () => {
      off();
      resolve();
    });
  });

export const useAudioPlayer = (options: UseAudioPlayerOptions): TAudioPlayer => {
  const { resolveSrc } = options;
  const playerRef = useRef<MediaPlayerInstance | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isPlaying = playingId !== null && !paused;
  const progress =
    duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  const toggle = useCallback(
    async (id: string) => {
      const player = playerRef.current;
      if (!player) return;

      if (playingId === id) {
        if (paused) {
          player.play().catch((err) => {
            console.error("[audio] play failed", err);
          });
        } else {
          try {
            player.pause();
          } catch (err) {
            console.error("[audio] pause failed", err);
          }
        }
        return;
      }

      const url = await resolveSrc(id);
      if (!url) return;

      setSrc(url);
      setPlayingId(id);
      setCurrentTime(0);
      setDuration(0);
      requestAnimationFrame(() => {
        player.play().catch(async (err) => {
          if (
            err?.code === 4 ||
            /not ready/i.test(String(err?.message ?? ""))
          ) {
            await waitForCanPlay(player);
            player.play().catch((e) => console.error("[audio] play failed", e));
            return;
          }
          console.error("[audio] play failed", err);
        });
      });
    },
    [resolveSrc, playingId, paused],
  );

  const seekRatio = useCallback((ratio: number) => {
    const player = playerRef.current;
    if (!player) return;
    const dur = player.duration;
    if (!Number.isFinite(dur) || dur <= 0) return;
    const clamped = Math.min(1, Math.max(0, ratio));
    player.currentTime = clamped * dur;
  }, []);

  const onTimeUpdate = useCallback((detail: MediaTimeUpdateEventDetail) => {
    setCurrentTime(
      Number.isFinite(detail.currentTime) ? detail.currentTime : 0,
    );
  }, []);

  const onDurationChange = useCallback((d: number) => {
    setDuration(Number.isFinite(d) && d > 0 ? d : 0);
  }, []);

  const onPlay = useCallback(() => setPaused(false), []);
  const onPause = useCallback(() => setPaused(true), []);

  return {
    playerRef,
    src,
    playingId,
    isPlaying,
    currentTime,
    duration,
    progress,
    toggle,
    seekRatio,
    onTimeUpdate,
    onDurationChange,
    onPlay,
    onPause,
  };
};
