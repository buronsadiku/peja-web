import { cn } from "@peja/ui/utils/cn";

type KioskPreviewTabProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export const KioskPreviewTab = ({
  label,
  active,
  onClick,
}: KioskPreviewTabProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded-8 type-caption cursor-pointer px-3 py-1.5 font-semibold",
      active
        ? "border-border bg-background text-foreground border"
        : "text-muted-foreground border border-transparent",
    )}
  >
    {label}
  </button>
);
