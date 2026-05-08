import { cn } from "@peja/ui/utils/cn";

type ChecklistItemProps = {
  index: number;
  label: string;
  active?: boolean;
};

export const ChecklistItem = ({
  index,
  label,
  active = false,
}: ChecklistItemProps) => (
  <div
    className={cn(
      "type-body-small flex items-center gap-3",
      active ? "opacity-100" : "opacity-70",
    )}
  >
    <span
      className={cn(
        "type-caption flex size-5.5 shrink-0 items-center justify-center rounded-full font-bold",
        active ? "bg-destructive text-primary-foreground" : "bg-white/15",
      )}
    >
      {index}
    </span>
    <span>{label}</span>
  </div>
);
