type WaveformBarProps = {
  height: number;
  variant: "primary" | "mini";
};

export const HowItWorksWaveformBar = ({
  height,
  variant,
}: WaveformBarProps) => (
  <div
    className={
      variant === "primary"
        ? "bg-destructive w-0.75 rounded-full opacity-70"
        : "bg-secondary w-0.5 rounded-full opacity-80"
    }
    style={{ height: `${height}px` }}
  />
);
