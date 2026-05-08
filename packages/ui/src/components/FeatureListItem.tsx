import { cn } from "../utils/cn";
import { CheckIcon } from "@peja/icons/CheckIcon";

type FeatureListItemProps = {
  children: React.ReactNode;
  checkClassName?: string;
  className?: string;
};

export const FeatureListItem = ({
  children,
  checkClassName = "text-primary",
  className,
}: FeatureListItemProps) => (
  <li className={cn("type-body-small flex items-start gap-2.5", className)}>
    <span className={checkClassName}>
      <CheckIcon className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} />
    </span>
    {children}
  </li>
);
