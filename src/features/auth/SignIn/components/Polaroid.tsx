type PolaroidProps = {
  top: number;
  left?: number;
  right?: number;
  rotation: number;
  initial: string;
  name: string;
  tint: string;
};

export const Polaroid = ({
  top,
  left,
  right,
  rotation,
  initial,
  name,
  tint,
}: PolaroidProps) => (
  <div
    className="rounded-4 bg-card absolute w-32.5 p-2 pb-7 shadow-lg"
    style={{ top, left, right, transform: `rotate(${rotation}deg)` }}
  >
    <div
      className="text-primary-foreground flex h-32.5 w-full items-center justify-center rounded-sm font-serif text-4xl font-semibold"
      style={{ background: `linear-gradient(160deg, ${tint}, ${tint}AA)` }}
    >
      {initial}
    </div>
    <p className="type-caption text-muted-foreground absolute right-0 bottom-2 left-0 text-center font-serif italic">
      {name}
    </p>
  </div>
);
