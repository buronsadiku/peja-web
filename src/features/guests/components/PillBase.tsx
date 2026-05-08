import { cn } from "@peja/ui/utils/cn";

type PillBaseProps = {
  children: React.ReactNode;
  className?: string;
};

export const PillBase = ({ children, className }: PillBaseProps) => (
  <span
    className={cn(
      "type-caption inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold tracking-wide whitespace-nowrap",
      className,
    )}
  >
    {children}
  </span>
);
