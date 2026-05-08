import type { Day } from "@/features/marketing/data/activities";

type DayFilter = "all" | Day;

type FilterButtonConfig = {
  value: DayFilter;
  label: string;
  count: number;
};

type DayFilterBarProps = {
  filter: DayFilter;
  onChange: (next: DayFilter) => void;
  buttons: FilterButtonConfig[];
};

const FilterButton = ({
  config,
  active,
  onClick,
}: {
  config: FilterButtonConfig;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 ${
        active
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 scale-105"
          : "bg-card border border-border text-foreground hover:border-primary"
      }`}
    >
      {config.label}{" "}
      <span className="ml-2 text-sm opacity-75">({config.count})</span>
    </button>
  );
};

export const DayFilterBar = ({
  filter,
  onChange,
  buttons,
}: DayFilterBarProps) => {
  return (
    <div className="mb-12">
      <p className="text-center text-muted-foreground mb-6 text-lg">
        Filter activities by day
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {buttons.map((b) => (
          <FilterButton
            key={b.value}
            config={b}
            active={filter === b.value}
            onClick={() => onChange(b.value)}
          />
        ))}
      </div>
    </div>
  );
};

export type { DayFilter };
