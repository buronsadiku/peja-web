import { cn } from "@peja/ui/utils/cn";

type DecorativeBlobProps = {
  className?: string;
  color: string;
  size: number;
};

const STYLE_MAP: Record<string, string> = {
  destructive:
    "radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)",
  accent:
    "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)",
};

export const DecorativeBlob = ({
  className,
  color,
  size,
}: DecorativeBlobProps) => (
  <div
    className={cn(
      "pointer-events-none absolute rounded-full transition-all duration-700",
      className,
    )}
    style={{
      background: STYLE_MAP[color],
      width: size,
      height: size,
    }}
  />
);
