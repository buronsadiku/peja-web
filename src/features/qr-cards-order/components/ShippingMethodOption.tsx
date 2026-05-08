type ShippingMethodOptionProps = {
  title: string;
  description: string;
  priceLabel: string;
  selected: boolean;
  onSelect: () => void;
};

export const ShippingMethodOption = ({
  title,
  description,
  priceLabel,
  selected,
  onSelect,
}: ShippingMethodOptionProps) => (
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
      <span className="type-body block font-semibold">{title}</span>
      <span className="type-caption text-muted-foreground mt-0.5 block">
        {description}
      </span>
    </span>
    <span className="type-body-small font-mono font-semibold">
      {priceLabel}
    </span>
  </button>
);
