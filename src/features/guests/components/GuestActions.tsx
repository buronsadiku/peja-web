import { GuestNudgeCard } from "./GuestNudgeCard";
import { GuestThankYouCard } from "./GuestThankYouCard";

export const GuestActions = () => (
  <div className="desktop:grid-cols-[1.3fr_1fr] grid gap-5">
    <GuestNudgeCard />
    <GuestThankYouCard />
  </div>
);
