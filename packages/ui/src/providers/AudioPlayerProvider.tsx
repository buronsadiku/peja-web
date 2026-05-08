"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAudioPlayer, type TAudioPlayer } from "../hooks/useAudioPlayer";
import { AudioPlayer } from "../components/AudioPlayer";

const AudioPlayerContext = createContext<TAudioPlayer | null>(null);

export const useSharedAudioPlayer = (): TAudioPlayer => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("Missing AudioPlayerProvider");
  return ctx;
};

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const player = useAudioPlayer({ resolveSrc: async (id) => id });

  return (
    <AudioPlayerContext value={player}>
      {children}
      <AudioPlayer player={player} />
    </AudioPlayerContext>
  );
};
