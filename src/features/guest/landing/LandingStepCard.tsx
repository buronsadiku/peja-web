import type { ReactNode } from "react";
import { cn } from "@peja/ui/utils/cn";

type LandingStepCardProps = {
  index: number;
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconClassName: string;
};

const padIndex = (n: number) => String(n).padStart(2, "0");

export const LandingStepCard = ({
  index,
  title,
  subtitle,
  icon,
  iconClassName,
}: LandingStepCardProps) => (
  <div className="bg-card/65 border-border rounded-16 flex items-center gap-3.5 border p-3.5 backdrop-blur-sm">
    <div
      className={cn(
        "rounded-12 flex size-10 shrink-0 items-center justify-center text-primary-foreground",
        iconClassName,
      )}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="type-h4 font-semibold leading-tight">
        {title}
      </h3>
      <p className="type-body-small text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
    <span className="type-h3 text-muted-foreground/40 font-semibold">
      {padIndex(index)}
    </span>
  </div>
);
