import { cn } from "../utils/cn";

type LogoProps = {
  iconOnly?: boolean;
  className?: string;
};

export const Logo = ({ iconOnly, className }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg font-serif text-base font-bold">
        O
      </div>
      {!iconOnly && (
        <span className="text-foreground font-serif text-xl font-semibold">
          Peja
        </span>
      )}
    </div>
  );
};
