import { HowItWorksQrCell } from "./HowItWorksQrCell";

type QrCardProps = {
  rotation: number;
  translateX: number;
};

export const HowItWorksQrCard = ({ rotation, translateX }: QrCardProps) => (
  <div
    className="bg-card border-border absolute flex h-37.5 w-27.5 flex-col items-center justify-center gap-1.5 rounded-lg border p-3"
    style={{ transform: `rotate(${rotation}deg) translateX(${translateX}px)` }}
  >
    <div className="grid w-full grid-cols-5 gap-0.5">
      {Array.from({ length: 25 }).map((_, j) => (
        <HowItWorksQrCell key={j} index={j} />
      ))}
    </div>
  </div>
);
