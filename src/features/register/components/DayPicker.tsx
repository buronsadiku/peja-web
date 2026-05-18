"use client";

import { useFormatDate } from "@/lib/i18n/useFormatDate";
import type { FestivalDay } from "@/lib/api/types";

type DayPickerProps = {
  days: FestivalDay[];
  selectedId: string | null;
  onChange: (festivalDayId: string) => void;
};

export const DayPicker = ({ days, selectedId, onChange }: DayPickerProps) => {
  const formatDate = useFormatDate();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {days.map((day) => {
        const d = new Date(day.date + "T00:00:00");
        const weekday = formatDate(d, { weekday: "long" });
        const monthDay = formatDate(d, { month: "short", day: "numeric" });
        const active = selectedId === day.id;
        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onChange(day.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              active
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/50"
                : "bg-background border-border hover:border-primary"
            }`}
          >
            <p className="font-bold text-lg">{day.label ?? weekday}</p>
            <p
              className={`text-sm ${
                active ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}
            >
              {monthDay}
            </p>
          </button>
        );
      })}
    </div>
  );
};
