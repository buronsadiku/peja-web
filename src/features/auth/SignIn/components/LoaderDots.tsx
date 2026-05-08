import { LoaderDot } from "./LoaderDot";

const COLORS = [
  "oklch(0.705 0.120 262.5)",
  "oklch(0.723 0.135 40)",
  "oklch(0.818 0.105 73.3)",
  "oklch(0.833 0.132 151.8)",
];

type LoaderDotsProps = {
  activeIndex?: number;
};

export const LoaderDots = ({ activeIndex = 1 }: LoaderDotsProps) => (
  <div className="inline-flex gap-2">
    {COLORS.map((color, i) => (
      <LoaderDot key={i} color={color} active={i === activeIndex} />
    ))}
  </div>
);
