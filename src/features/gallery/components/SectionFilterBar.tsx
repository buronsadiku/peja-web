"use client";

import type { GallerySection } from "@/lib/api/types";

export type SectionFilter = "all" | GallerySection;

type SectionFilterBarProps = {
  filter: SectionFilter;
  onChange: (next: SectionFilter) => void;
  counts: Record<SectionFilter, number | undefined>;
};

const filters: { value: SectionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "workshops", label: "Workshops" },
  { value: "adventures", label: "Adventures" },
  { value: "food", label: "Food & Wine" },
];

export const SectionFilterBar = ({
  filter,
  onChange,
  counts,
}: SectionFilterBarProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {filters.map((f) => {
        const active = filter === f.value;
        const count = counts[f.value];
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${
              active
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 scale-105"
                : "bg-card border border-border text-foreground hover:border-primary"
            }`}
          >
            {f.label}
            {count !== undefined ? (
              <span className="ml-2 text-sm opacity-75">({count})</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
