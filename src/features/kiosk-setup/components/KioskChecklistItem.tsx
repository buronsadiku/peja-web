import { CheckIcon } from "@peja/icons/CheckIcon";
import { Button } from "@peja/ui/components/Button";
import { cn } from "@peja/ui/utils/cn";

type KioskChecklistItemProps = {
  title: string;
  description: string;
  done: boolean;
  cta?: string;
};

export const KioskChecklistItem = ({
  title,
  description,
  done,
  cta,
}: KioskChecklistItemProps) => (
  <div
    className={cn(
      "rounded-16 bg-card flex items-start gap-3 border p-4",
      done ? "border-secondary/40" : "border-border",
    )}
  >
    <div
      className={cn(
        "mt-0.5 flex size-6.5 shrink-0 items-center justify-center rounded-full",
        done ? "bg-secondary" : "border-border bg-card border-2",
      )}
    >
      {done && <CheckIcon width={14} height={14} className="text-background" />}
    </div>
    <div className="min-w-0 flex-1">
      <div
        className={cn(
          "type-body-small font-semibold",
          done && "decoration-foreground/25 line-through",
        )}
      >
        {title}
      </div>
      <div className="type-caption text-muted-foreground mt-0.5 leading-snug">
        {description}
      </div>
      {cta && !done && (
        <Button size="sm" className="mt-2.5 rounded-full">
          {cta}
        </Button>
      )}
    </div>
  </div>
);
