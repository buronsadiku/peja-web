import { CheckIcon } from "@peja/icons/CheckIcon";

type AvailableBadgeProps = {
  label: string;
};

export const AvailableBadge = ({ label }: AvailableBadgeProps) => (
  <div className="bg-secondary/30 type-caption text-secondary-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold">
    <CheckIcon width={12} height={12} strokeWidth={3} />
    {label}
  </div>
);
