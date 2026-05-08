import { StepCard } from "@peja/ui/components/StepCard";
import { STEP_COLORS } from "./constants";

type HowItWorksStepProps = {
  number: string;
  stepNumber: number;
  tag: string;
  title: string;
  body: string;
  illustration: React.ReactNode;
};

export const HowItWorksStep = ({
  number,
  stepNumber,
  tag,
  title,
  body,
  illustration,
}: HowItWorksStepProps) => (
  <StepCard
    number={number}
    numberClassName={STEP_COLORS[stepNumber]}
    tag={tag}
    title={title}
    body={body}
    illustration={illustration}
  />
);
