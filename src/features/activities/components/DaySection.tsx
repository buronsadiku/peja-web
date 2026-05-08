import type { ActivityListItem } from "@/lib/api/types";
import { ActivityCard } from "./ActivityCard";

type DaySectionProps = {
  date: string;
  label: string | null;
  activities: ActivityListItem[];
};

const formatDateLabel = (date: string) => {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const dayName = (date: string) => {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
};

export const DaySection = ({ date, label, activities }: DaySectionProps) => {
  if (activities.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border" />
        <h2 className="text-4xl md:text-5xl font-black text-primary">
          {label ?? dayName(date)}
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      <p className="text-center text-xl text-muted-foreground mb-12">
        {formatDateLabel(date)}
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity.occurrenceId} activity={activity} />
        ))}
      </div>
    </div>
  );
};
