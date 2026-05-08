import { CheckIcon } from "@peja/icons/CheckIcon";

type PlanFeatureProps = {
  label: string;
};

export const PlanFeature = ({ label }: PlanFeatureProps) => (
  <div className="type-body-small flex items-start gap-2">
    <CheckIcon
      width={14}
      height={14}
      className="text-primary mt-0.5 shrink-0"
      strokeWidth={2.2}
    />
    {label}
  </div>
);
