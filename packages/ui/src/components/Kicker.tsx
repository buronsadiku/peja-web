import { cn } from "../utils/cn";

type KickerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Kicker = ({ children, className }: KickerProps) => (
  <p
    className={cn(
      "type-overline font-bold uppercase",
      className,
    )}
  >
    {children}
  </p>
);
