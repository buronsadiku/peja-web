"use client";

import { useFormatDate } from "@/lib/i18n/useFormatDate";
import type { ActivityListItem } from "@/lib/api/types";
import { ActivityCard } from "./ActivityCard";

type DaySectionProps = {
  date: string;
  label: string | null;
  activities: ActivityListItem[];
};

export const DaySection = ({ date, label, activities }: DaySectionProps) => {
  const formatDate = useFormatDate();
  if (activities.length === 0) return null;

  const d = new Date(date + "T00:00:00");
  const weekday = formatDate(d, { weekday: "long" }).toUpperCase();
  const longDate = formatDate(d, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border" />
        <h2 className="text-4xl md:text-5xl font-black text-primary">
          {label ?? weekday}
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      <p className="text-center text-xl text-muted-foreground mb-12">
        {longDate}
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity.occurrenceId} activity={activity} />
        ))}
      </div>
    </div>
  );
};
