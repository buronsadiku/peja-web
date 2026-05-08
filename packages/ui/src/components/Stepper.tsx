"use client";

import { cn } from "../utils/cn";

type StepperProps = {
  currentStep: number;
  totalSteps?: number;
  className?: string;
};

export const Stepper = ({
  currentStep,
  totalSteps = 8,
  className,
}: StepperProps) => {
  const padded = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="type-caption text-muted-foreground font-mono">
        Step {padded(currentStep)} of {padded(totalSteps)}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <StepperBar key={i} active={i < currentStep} />
        ))}
      </div>
    </div>
  );
};

const StepperBar = ({ active }: { active: boolean }) => (
  <div
    className={cn(
      "h-1 w-7 rounded-full transition-colors",
      active ? "bg-primary" : "bg-foreground/7",
    )}
  />
);
