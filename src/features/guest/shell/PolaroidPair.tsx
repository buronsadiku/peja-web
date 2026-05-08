import { Polaroid } from "./Polaroid";

type PolaroidPairProps = {
  partnerAName: string;
  partnerBName: string;
  themeColor: string;
};

const accentBackground = (themeColor: string) =>
  `linear-gradient(160deg, ${themeColor}, color-mix(in oklch, ${themeColor} 65%, black))`;

const counterBackground = "linear-gradient(160deg, var(--accent), var(--destructive))";

export const PolaroidPair = ({
  partnerAName,
  partnerBName,
  themeColor,
}: PolaroidPairProps) => (
  <div className="relative mx-auto aspect-square w-56">
    <div className="absolute inset-0 -translate-x-3.5 translate-y-1.5 -rotate-6">
      <Polaroid
        initial={partnerBName.charAt(0).toUpperCase()}
        caption={partnerBName}
        background={accentBackground(themeColor)}
      />
    </div>
    <div className="absolute inset-0 translate-x-3.5 -translate-y-0.5 rotate-6">
      <Polaroid
        initial={partnerAName.charAt(0).toUpperCase()}
        caption={partnerAName}
        background={counterBackground}
      />
    </div>
  </div>
);
