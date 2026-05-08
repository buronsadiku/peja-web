"use client";

import { useEffect } from "react";
import { useSignUpStore } from "./useSignUpStore";
import { CreateAccountStep } from "./steps/CreateAccountStep";
import { VerifyEmailStep } from "./steps/VerifyEmailStep";
import { BookDetailsStep } from "./steps/BookDetailsStep";
import { CoverPhotoStep } from "./steps/CoverPhotoStep";
import { ClaimUrlStep } from "./steps/ClaimUrlStep";
import { ChoosePlanStep } from "./steps/ChoosePlanStep";
import { CompletionStep } from "./steps/CompletionStep";

const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  1: CreateAccountStep,
  2: VerifyEmailStep,
  3: BookDetailsStep,
  4: CoverPhotoStep,
  5: ClaimUrlStep,
  6: ChoosePlanStep,
  7: CompletionStep,
};

type SignUpFlowProps = {
  step: number;
};

export const SignUpFlow = ({ step }: SignUpFlowProps) => {
  const setStep = useSignUpStore((s) => s.setStep);

  useEffect(() => {
    setStep(step);
  }, [step, setStep]);

  const StepComponent = STEP_COMPONENTS[step] ?? CreateAccountStep;

  return <StepComponent />;
};
