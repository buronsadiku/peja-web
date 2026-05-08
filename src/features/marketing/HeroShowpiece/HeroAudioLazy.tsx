"use client";

import dynamic from "next/dynamic";

const HeroAudio = dynamic(
  () => import("./HeroAudio").then((m) => ({ default: m.HeroAudio })),
  { ssr: false },
);

export const HeroAudioLazy = () => <HeroAudio />;
