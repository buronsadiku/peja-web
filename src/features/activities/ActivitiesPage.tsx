"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { activities, type Day } from "@/features/marketing/data/activities";
import { DayFilterBar, type DayFilter } from "./components/DayFilterBar";
import { DaySection } from "./components/DaySection";

const orderedDays: Day[] = ["thursday", "friday", "saturday", "sunday"];

const countByDay = (day: Day) =>
  activities.filter((a) => a.day === day).length;

export const ActivitiesPage = () => {
  const [filter, setFilter] = useState<DayFilter>("all");

  const filterButtons = [
    { value: "all" as const, label: "All Days", count: activities.length },
    { value: "thursday" as const, label: "Thursday", count: countByDay("thursday") },
    { value: "friday" as const, label: "Friday", count: countByDay("friday") },
    { value: "saturday" as const, label: "Saturday", count: countByDay("saturday") },
    { value: "sunday" as const, label: "Sunday", count: countByDay("sunday") },
  ];

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            FESTIVAL <span className="text-primary">ACTIVITIES</span>
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us for four days of incredible experiences from Thursday to
            Sunday
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <DayFilterBar
            filter={filter}
            onChange={setFilter}
            buttons={filterButtons}
          />

          {orderedDays.map((day) => {
            if (filter !== "all" && filter !== day) return null;
            const dayActivities = activities.filter((a) => a.day === day);
            return (
              <DaySection key={day} day={day} activities={dayActivities} />
            );
          })}
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Join?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Register now to participate in all activities
          </p>
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-12 py-4 rounded-full text-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/50"
          >
            Register Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
