import {
  type Activity,
  type Day,
  dayLabels,
} from "@/features/marketing/data/activities";
import { ActivityCard } from "./ActivityCard";

type DaySectionProps = {
  day: Day;
  activities: Activity[];
};

export const DaySection = ({ day, activities }: DaySectionProps) => {
  if (activities.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border" />
        <h2 className="text-4xl md:text-5xl font-black text-primary uppercase">
          {day}
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      <p className="text-center text-xl text-muted-foreground mb-12">
        {dayLabels[day]}
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};
