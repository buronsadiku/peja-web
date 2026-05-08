import { PolaroidPair } from "./PolaroidPair";

type HeroPhotoProps = {
  partnerAName: string;
  partnerBName: string;
  themeColor: string;
  couplePhotoUrl: string | null;
};

export const HeroPhoto = ({
  partnerAName,
  partnerBName,
  themeColor,
  couplePhotoUrl,
}: HeroPhotoProps) => {
  if (couplePhotoUrl) {
    return (
      <img
        src={couplePhotoUrl}
        alt={`${partnerAName} & ${partnerBName}`}
        className="border-card mx-auto size-50 rounded-full border-4 object-cover shadow-lg"
      />
    );
  }
  return (
    <PolaroidPair
      partnerAName={partnerAName}
      partnerBName={partnerBName}
      themeColor={themeColor}
    />
  );
};
