"use client";

import { ChevronDownIcon } from "@peja/icons/ChevronDownIcon";
import { cn } from "@peja/ui/utils/cn";

type KioskSelectOption<T extends string | number> = {
  value: T;
  label: string;
};

type KioskSelectProps<T extends string | number> = {
  value: T;
  options: KioskSelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export const KioskSelect = <T extends string | number>({
  value,
  options,
  onChange,
  className,
}: KioskSelectProps<T>) => {
  const numeric = typeof value === "number";
  return (
    <span
      className={cn(
        "border-border bg-card type-body-small relative inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2",
        className,
      )}
    >
      {options.find((o) => o.value === value)?.label}
      <ChevronDownIcon
        width={12}
        height={12}
        className="text-muted-foreground"
      />
      <select
        aria-label="Select option"
        className="absolute inset-0 cursor-pointer opacity-0"
        value={value}
        onChange={(e) =>
          onChange((numeric ? Number(e.target.value) : e.target.value) as T)
        }
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </span>
  );
};
