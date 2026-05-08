"use client";

import { Link } from "@/i18n/navigation";
import type { ActivityListItem, FestivalDay } from "@/lib/api/types";

const HOUR_HEIGHT = 56;
const START_HOUR = 7;
const END_HOUR = 24;

const categoryColor: Record<string, string> = {
  music: "bg-primary/80 text-primary-foreground",
  adventure: "bg-secondary/80 text-secondary-foreground",
  workshop: "bg-amber-600/80 text-white",
  cultural: "bg-purple-600/80 text-white",
  food: "bg-rose-600/80 text-white",
  wellness: "bg-emerald-600/80 text-white",
};

const minutesFromStart = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return (h - START_HOUR) * 60 + m;
};

type TimelineViewProps = {
  activities: ActivityListItem[];
  days: FestivalDay[];
  selectedDayId: string | null;
};

const dayLabel = (day: FestivalDay) =>
  day.label ??
  new Date(day.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
  });

export const TimelineView = ({
  activities,
  days,
  selectedDayId,
}: TimelineViewProps) => {
  const visibleDays = selectedDayId
    ? days.filter((d) => d.id === selectedDayId)
    : days;

  if (visibleDays.length === 0) return null;

  const totalHours = END_HOUR - START_HOUR;
  const totalHeight = totalHours * HOUR_HEIGHT;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div
        className="overflow-x-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `auto repeat(${visibleDays.length}, minmax(220px, 1fr))`,
            minHeight: totalHeight + 60,
          }}
        >
          {/* Header row */}
          <div className="sticky top-0 z-20 bg-card border-b border-border h-14" />
          {visibleDays.map((d) => (
            <div
              key={`head-${d.id}`}
              className="sticky top-0 z-20 bg-card border-b border-l border-border px-4 py-3 text-center"
            >
              <p className="font-black text-primary uppercase">
                {dayLabel(d)}
              </p>
              <p className="text-xs text-muted-foreground">{d.date}</p>
            </div>
          ))}

          {/* Hour rail */}
          <div
            className="relative border-r border-border bg-card"
            style={{ height: totalHeight }}
          >
            {Array.from({ length: totalHours + 1 }, (_, i) => START_HOUR + i).map(
              (h) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 text-xs text-muted-foreground text-right pr-3"
                  style={{ top: (h - START_HOUR) * HOUR_HEIGHT - 8 }}
                >
                  {String(h).padStart(2, "0")}:00
                </div>
              ),
            )}
          </div>

          {/* Day columns */}
          {visibleDays.map((d) => {
            const dayActivities = activities.filter(
              (a) => a.festivalDayId === d.id,
            );
            return (
              <div
                key={`col-${d.id}`}
                className="relative border-l border-border"
                style={{ height: totalHeight }}
              >
                {Array.from({ length: totalHours }, (_, i) => i).map((i) => (
                  <div
                    key={i}
                    className="border-t border-border/40"
                    style={{ height: HOUR_HEIGHT }}
                  />
                ))}
                {dayActivities.map((a) => {
                  const start = minutesFromStart(a.startTime);
                  const end = minutesFromStart(a.endTime);
                  const top = (start * HOUR_HEIGHT) / 60;
                  const height = Math.max(
                    32,
                    ((end - start) * HOUR_HEIGHT) / 60 - 4,
                  );
                  return (
                    <Link
                      key={a.occurrenceId}
                      href={`/activities/${a.slug}`}
                      className={`absolute left-2 right-2 rounded-lg px-3 py-2 overflow-hidden hover:scale-[1.02] transition-transform shadow-md ${
                        categoryColor[a.category] ?? "bg-muted"
                      }`}
                      style={{ top, height }}
                    >
                      <p className="font-bold text-sm leading-tight truncate">
                        {a.name}
                      </p>
                      <p className="text-xs opacity-80">
                        {a.startTime.slice(0, 5)}–{a.endTime.slice(0, 5)}
                      </p>
                      {a.location ? (
                        <p className="text-xs opacity-70 truncate">
                          {a.location}
                        </p>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
