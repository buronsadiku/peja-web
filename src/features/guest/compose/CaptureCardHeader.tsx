import type { ReactNode } from "react";
import { cn } from "@peja/ui/utils/cn";

type CaptureCardHeaderProps = {
  icon: ReactNode;
  title: string;
  meta?: string;
  iconClassName: string;
  filled: boolean;
};

export const CaptureCardHeader = ({
  icon,
  title,
  meta,
  iconClassName,
  filled,
}: CaptureCardHeaderProps) => (
  <div className="flex items-center gap-3.5">
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
      {meta && (
        <p className="type-body-small text-muted-foreground mt-0.5 truncate">
          {meta}
        </p>
      )}
    </div>
    {filled && <span className="bg-secondary size-2 shrink-0 rounded-full" />}
  </div>
);
