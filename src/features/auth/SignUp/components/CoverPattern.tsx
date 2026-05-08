type CoverPatternProps = {
  tint: string;
};

export const CoverPattern = ({ tint }: CoverPatternProps) => (
  <div
    className="size-full"
    style={{
      background: `repeating-linear-gradient(135deg, ${tint} 0 10px, color-mix(in oklch, ${tint}, #000 10%) 10px 20px)`,
    }}
  />
);
