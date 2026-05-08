import { cn } from "../utils/cn";
import { WaveformBar } from "./WaveformBar";

const seededRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

type WaveformProps = {
  bars?: number[];
  barCount?: number;
  height?: number;
  progress?: number;
  className?: string;
};

export const Waveform = ({
  bars,
  barCount = 32,
  height = 28,
  progress = 0,
  className,
}: WaveformProps) => {
  const data =
    bars ?? Array.from({ length: barCount }, (_, i) => seededRandom(i));
  const playHead = data.length * progress;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {data.map((h, i) => {
        const barFill = Math.min(1, Math.max(0, playHead - i));
        return (
          <WaveformBar
            key={i}
            height={Math.round(Math.max(h * height, 3) * 100) / 100}
            fill={barFill}
          />
        );
      })}
    </div>
  );
};
