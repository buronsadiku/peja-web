type ConfettiDotProps = {
  top: number;
  left?: number;
  right?: number;
  color: string;
  size: number;
  rotation: number;
};

export const ConfettiDot = ({
  top,
  left,
  right,
  color,
  size,
  rotation,
}: ConfettiDotProps) => (
  <div
    className="absolute rounded-sm"
    style={{
      top,
      left,
      right,
      width: size,
      height: size * 2,
      backgroundColor: color,
      transform: `rotate(${rotation}deg)`,
    }}
  />
);
