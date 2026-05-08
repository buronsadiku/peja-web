"use client";

import { Logo } from "@peja/ui/components/Logo";
import { Stepper } from "@peja/ui/components/Stepper";
import { useSignUpStore } from "@/features/auth/SignUp/useSignUpStore";

export const SignUpHeader = () => {
  const step = useSignUpStore((s) => s.step);
  const totalSteps = useSignUpStore((s) => s.totalSteps);

  return (
    <header className="border-border tablet:px-14 flex items-center justify-between border-b px-6 py-7">
      <Logo />
      <Stepper currentStep={step} totalSteps={totalSteps} />
      <button
        type="button"
        className="type-body-small text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      >
        Save &amp; finish later
      </button>
    </header>
  );
};
