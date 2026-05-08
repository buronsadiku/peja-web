import { cn } from "@peja/ui/utils/cn";

type FilterTabProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export const FilterTab = ({ label, active, onClick }: FilterTabProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "type-caption cursor-pointer rounded-full px-3 py-1.5 font-semibold whitespace-nowrap transition-colors",
      active
        ? "bg-foreground text-background"
        : "border-border bg-card text-muted-foreground hover:bg-muted border",
    )}
  >
    {label}
  </button>
);
