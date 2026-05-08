import type { PublicEvent } from "@/lib/api/types";
import { HeroDetails } from "./HeroDetails";
import { HeroPhoto } from "./HeroPhoto";
import { WelcomeQuote } from "./WelcomeQuote";

type GuestHeroProps = {
  event: PublicEvent;
};

export const GuestHero = ({ event }: GuestHeroProps) => (
  <div className="flex flex-col gap-6_5">
    <HeroPhoto
      partnerAName={event.partnerAName}
      partnerBName={event.partnerBName}
      themeColor={event.themeColor}
      couplePhotoUrl={event.couplePhotoUrl}
    />
    <HeroDetails event={event} />
    <WelcomeQuote event={event} />
  </div>
);
