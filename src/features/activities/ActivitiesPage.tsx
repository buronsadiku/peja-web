"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import { DayFilterBar } from "./components/DayFilterBar";
import { DaySection } from "./components/DaySection";

const dayShort = (date: string) => {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long" });
};

export const ActivitiesPage = () => {
  const [filter, setFilter] = useState("all");

  const activitiesQuery = useQuery({
    queryKey: ["activities"],
    queryFn: () => api.activities.list(),
  });

  const daysQuery = useQuery({
    queryKey: ["festival-days"],
    queryFn: () => api.activities.festivalDays(),
  });

  const activities = activitiesQuery.data ?? [];
  const days = daysQuery.data ?? [];

  const filterButtons = useMemo(() => {
    const buttons = [
      { value: "all", label: "All Days", count: activities.length },
    ];
    for (const day of days) {
      buttons.push({
        value: day.id,
        label: day.label ?? dayShort(day.date),
        count: activities.filter((a) => a.festivalDayId === day.id).length,
      });
    }
    return buttons;
  }, [activities, days]);

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            FESTIVAL <span className="text-primary">ACTIVITIES</span>
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us for incredible experiences across the festival
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          {activitiesQuery.isLoading ? (
            <p className="text-center text-muted-foreground">
              Loading activities…
            </p>
          ) : activitiesQuery.isError ? (
            <p className="text-center text-destructive">
              Failed to load activities. Try again later.
            </p>
          ) : (
            <>
              <DayFilterBar
                filter={filter}
                onChange={setFilter}
                buttons={filterButtons}
              />

              {days.map((day) => {
                if (filter !== "all" && filter !== day.id) return null;
                const dayActivities = activities.filter(
                  (a) => a.festivalDayId === day.id,
                );
                return (
                  <DaySection
                    key={day.id}
                    date={day.date}
                    label={day.label}
                    activities={dayActivities}
                  />
                );
              })}
            </>
          )}
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
