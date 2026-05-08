type QrCellProps = {
  index: number;
};

export const HowItWorksQrCell = ({ index }: QrCellProps) => (
  <div
    className="aspect-square rounded-[1px]"
    style={{
      backgroundColor:
        (index + Math.floor(index / 5)) % 2 === 0
          ? "var(--foreground)"
          : "transparent",
    }}
  />
);
