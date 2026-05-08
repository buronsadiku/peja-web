import type { EventStats } from "@/lib/api/types";
import { StatItem } from "./StatItem";

type StatLineProps = {
  stats: EventStats;
};

export const StatLine = ({ stats }: StatLineProps) => {
  const items = [
    { value: String(stats.totalMessages), label: "messages" },
    { value: String(stats.photoCount), label: "photos" },
    { value: String(stats.audioMessages), label: "audio" },
    { value: String(stats.favorites), label: "favourites" },
  ];

  return (
    <div className="border-border tablet:flex tablet:gap-14 grid grid-cols-2 gap-6 border-b py-5 pb-8">
      {items.map((s) => (
        <StatItem key={s.label} value={s.value} label={s.label} />
      ))}
    </div>
  );
};
