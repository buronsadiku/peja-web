"use client";
import { AudioWavePlayer } from "@peja/ui/components/AudioWavePlayer";
import { useSharedAudioPlayer } from "@peja/ui/providers/AudioPlayerProvider";

const SRC = "/sample-audio.mp3";

export const HeroAudio = () => {
  const player = useSharedAudioPlayer();
  return (
    <AudioWavePlayer
      src={SRC}
      id={SRC}
      player={player}
      barCount={44}
      height={44}
      className="mt-4"
      wave
    />
  );
};
