import { cn } from "@peja/ui/utils/cn";

type FeaturesRitualBarProps = {
  index: number;
};

export const FeaturesRitualBar = ({ index }: FeaturesRitualBarProps) => (
  <div
    className={cn(
      "w-3.5 rounded-sm",
      index < 12 ? "bg-primary h-7.5" : "bg-foreground/10 h-5.5",
    )}
  />
);
