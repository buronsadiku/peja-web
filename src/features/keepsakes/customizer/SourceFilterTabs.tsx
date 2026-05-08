"use client";

export type SourceFilter = "all" | "favorites" | "gold_book";

const TABS: Array<{ value: SourceFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "favorites", label: "Favorites" },
  { value: "gold_book", label: "Gold Book" },
];

type SourceFilterTabsProps = {
  value: SourceFilter;
  onChange: (value: SourceFilter) => void;
};

export const SourceFilterTabs = ({ value, onChange }: SourceFilterTabsProps) => {
  return (
    <div className="rounded-12 border-border bg-muted/40 inline-flex gap-1 self-start border p-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`rounded-8 px-3 py-1.5 transition ${
            value === tab.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="type-caption tracking-wider">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
