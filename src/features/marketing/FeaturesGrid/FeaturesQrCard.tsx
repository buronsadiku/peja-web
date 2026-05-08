import { cn } from "@peja/ui/utils/cn";

type FeaturesQrCardProps = {
  rotation: string;
};

export const FeaturesQrCard = ({ rotation }: FeaturesQrCardProps) => (
  <div
    className={cn(
      "border-border bg-card h-13.5 w-9.5 rounded border",
      rotation,
    )}
  />
);
