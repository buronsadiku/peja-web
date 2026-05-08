"use client";

import { useId } from "react";
import { cn } from "@peja/ui/utils/cn";

type KioskStepSliderProps<T extends number> = {
  value: T;
  steps: readonly T[];
  labels: readonly string[];
  onChange: (value: T) => void;
};

export const KioskStepSlider = <T extends number>({
  value,
  steps,
  labels,
  onChange,
}: KioskStepSliderProps<T>) => {
  const id = useId();
  const index = Math.max(0, steps.indexOf(value));
  const percent = steps.length > 1 ? (index / (steps.length - 1)) * 100 : 0;

  return (
    <div>
      <div className="bg-border relative mt-3.5 h-1.5 rounded-full">
        <div
          className="bg-primary absolute inset-y-0 left-0 rounded-full transition-[width]"
          style={{ width: `${percent}%` }}
        />
        <div
          className="border-primary bg-card absolute top-1/2 size-5 -translate-y-1/2 rounded-full border-2 shadow-sm transition-[left]"
          style={{ left: `calc(${percent}% - 10px)` }}
        />
        <input
          id={id}
          type="range"
          min={0}
          max={steps.length - 1}
          step={1}
          value={index}
          onChange={(e) => onChange(steps[Number(e.target.value)])}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
          aria-label="Slider"
        />
      </div>
      <div className="type-caption text-muted-foreground mt-2 flex justify-between">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => onChange(steps[i])}
            className={cn(
              "cursor-pointer transition-colors",
              i === index && "text-foreground font-semibold",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
