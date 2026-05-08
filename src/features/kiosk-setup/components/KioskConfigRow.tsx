import { cn } from "@peja/ui/utils/cn";

type KioskConfigRowProps = {
  title: string;
  description?: string;
  last?: boolean;
  children: React.ReactNode;
};

export const KioskConfigRow = ({
  title,
  description,
  last,
  children,
}: KioskConfigRowProps) => (
  <div
    className={cn(
      "grid grid-cols-[1fr_auto] items-center gap-10 py-4.5",
      !last && "border-border border-b",
    )}
  >
    <div>
      <div className="type-body-small font-semibold">{title}</div>
      {description && (
        <div className="type-caption text-muted-foreground mt-0.5 max-w-md leading-relaxed">
          {description}
        </div>
      )}
    </div>
    <div className="flex items-center gap-3">{children}</div>
  </div>
);
