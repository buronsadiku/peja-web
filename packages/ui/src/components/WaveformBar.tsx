"use client";

type WaveformBarProps = {
  height: number;
  fill: number;
};

export const WaveformBar = ({ height, fill }: WaveformBarProps) => (
  <span
    className="bg-primary/20 relative min-w-px flex-1 overflow-hidden rounded-full"
    style={{ height }}
  >
    <span
      className="bg-primary absolute inset-x-0 top-0 bottom-0 origin-left rounded-full transition-transform duration-300 ease-linear"
      style={{ transform: `scaleX(${fill})` }}
    />
  </span>
);
