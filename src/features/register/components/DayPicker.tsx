type DayPickerProps = {
  dates: string[];
  selected: string | null;
  onChange: (date: string) => void;
};

const formatDay = (date: string) => {
  const d = new Date(date + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    monthDay: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
};

export const DayPicker = ({ dates, selected, onChange }: DayPickerProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {dates.map((date) => {
        const { weekday, monthDay } = formatDay(date);
        const active = selected === date;
        return (
          <button
            key={date}
            type="button"
            onClick={() => onChange(date)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              active
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/50"
                : "bg-background border-border hover:border-primary"
            }`}
          >
            <p className="font-bold text-lg">{weekday}</p>
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
