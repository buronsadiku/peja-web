import { HowItWorksQrCard } from "./HowItWorksQrCard";
import { QR_CARDS } from "./constants";

export const HowItWorksStep1 = () => (
  <div className="relative flex h-40 items-center justify-center">
    <div className="relative flex h-37.5 w-37.5 items-center justify-center">
      {QR_CARDS.map((card) => (
        <HowItWorksQrCard
          key={card.rotation}
          rotation={card.rotation}
          translateX={card.translateX}
        />
      ))}
    </div>
  </div>
);
