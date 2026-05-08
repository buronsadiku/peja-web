"use client";

import { SignInFormStep } from "./steps/SignInFormStep";
import { TwoFactorStep } from "./steps/TwoFactorStep";
import { WelcomeBackStep } from "./steps/WelcomeBackStep";

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  form: SignInFormStep,
  verify: TwoFactorStep,
  welcome: WelcomeBackStep,
};

type SignInFlowProps = {
  step: string;
};

export const SignInFlow = ({ step }: SignInFlowProps) => {
  const StepComponent = STEP_COMPONENTS[step] ?? SignInFormStep;
  return <StepComponent />;
};
