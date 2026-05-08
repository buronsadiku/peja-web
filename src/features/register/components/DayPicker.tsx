import type { FestivalDay } from "@/lib/api/types";

type DayPickerProps = {
  days: FestivalDay[];
  selectedId: string | null;
  onChange: (festivalDayId: string) => void;
};

const formatDay = (date: string) => {
  const d = new Date(date + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    monthDay: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
};

export const DayPicker = ({ days, selectedId, onChange }: DayPickerProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {days.map((day) => {
        const { weekday, monthDay } = formatDay(day.date);
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
