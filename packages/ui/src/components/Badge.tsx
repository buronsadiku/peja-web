import { cn } from "../utils/cn";

type BadgeProps = React.ComponentProps<"span"> & {
  variant?: "default" | "destructive" | "secondary" | "outline";
};

const variantClasses = {
  default: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-border bg-card text-muted-foreground",
};

export const Badge = ({
  variant = "default",
  className,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "type-overline inline-flex items-center rounded-full px-2 py-0.5 font-bold",
      variantClasses[variant],
      className,
    )}
    {...props}
  />
);
