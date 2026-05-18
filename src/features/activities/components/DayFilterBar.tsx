"use client";

import { useTranslations } from "next-intl";

type FilterButtonConfig = {
  value: string;
  label: string;
  count: number;
};

type DayFilterBarProps = {
  filter: string;
  onChange: (next: string) => void;
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
  const t = useTranslations("activities");
  return (
    <div className="mb-12">
      <p className="text-center text-muted-foreground mb-6 text-lg">
        {t("filter_by_day")}
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
