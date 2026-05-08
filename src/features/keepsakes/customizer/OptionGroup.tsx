"use client";

type Option<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

type OptionGroupProps<T extends string> = {
  label: string;
  value: T | null;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export const OptionGroup = <T extends string>({
  label,
  value,
  options,
  onChange,
}: OptionGroupProps<T>) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="type-caption text-muted-foreground tracking-wider">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-12 border px-4 py-2 text-left transition ${
              value === option.value
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-foreground/20"
            }`}
          >
            <span className="type-body-small font-medium">{option.label}</span>
            {option.hint && (
              <span className="type-caption text-muted-foreground mt-0.5 block">
                {option.hint}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
