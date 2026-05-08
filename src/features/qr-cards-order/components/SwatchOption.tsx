type SwatchOptionProps = {
  color: string;
  name: string;
  selected: boolean;
  onSelect: () => void;
};

export const SwatchOption = ({
  color,
  name,
  selected,
  onSelect,
}: SwatchOptionProps) => (
  <button
    type="button"
    onClick={onSelect}
    className="flex flex-col items-center gap-1.5"
  >
    <span
      className={
        "rounded-12 size-12 border " +
        (selected
          ? "border-primary border-2 ring-primary/20 ring-2"
          : "border-border")
      }
      style={{ background: color }}
    />
    <span
      className={
        "type-caption " +
        (selected
          ? "text-foreground font-semibold"
          : "text-muted-foreground")
      }
    >
      {name}
    </span>
  </button>
);
