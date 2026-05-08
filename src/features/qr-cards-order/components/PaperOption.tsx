type PaperOptionProps = {
  title: string;
  description: string;
  priceLabel: string;
  badge?: string;
  selected: boolean;
  onSelect: () => void;
};

export const PaperOption = ({
  title,
  description,
  priceLabel,
  badge,
  selected,
  onSelect,
}: PaperOptionProps) => (
  <button
    type="button"
    onClick={onSelect}
    className={
      "rounded-12 flex w-full items-center gap-3.5 border p-4 text-left transition " +
      (selected
        ? "border-primary bg-primary/10 ring-primary/20 ring-4"
        : "border-border bg-card hover:bg-muted")
    }
  >
    <span
      className={
        "flex size-5 shrink-0 items-center justify-center rounded-full border " +
        (selected
          ? "border-primary border-4 bg-card"
          : "border-border bg-card")
      }
    />
    <span className="flex-1">
      <span className="flex flex-wrap items-center gap-2.5">
        <span className="type-body font-semibold">{title}</span>
        {badge && (
          <span className="type-overline rounded-full bg-secondary text-secondary-foreground px-2 py-0.5 tracking-wider">
            {badge}
          </span>
        )}
      </span>
      <span className="type-caption text-muted-foreground mt-0.5 block">
        {description}
      </span>
    </span>
    <span className="type-body-small font-mono font-semibold">
      {priceLabel}
    </span>
  </button>
);
