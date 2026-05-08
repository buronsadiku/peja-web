"use client";

import { forwardRef, useRef, useCallback } from "react";
import { cn } from "../utils/cn";

type OtpInputProps = {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export const OtpInput = ({
  length = 6,
  value = "",
  onChange,
  className,
}: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value
    .split("")
    .concat(Array(Math.max(0, length - value.length)).fill(""));

  const handleChange = useCallback(
    (index: number, char: string) => {
      if (!/^\d?$/.test(char)) return;
      const newValue = [...digits];
      newValue[index] = char;
      onChange?.(newValue.join("").slice(0, length));
      if (char && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, length, onChange],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);
      onChange?.(pasted);
      const focusIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    },
    [length, onChange],
  );

  return (
    <div className={cn("flex justify-center gap-2.5", className)}>
      {digits.slice(0, length).map((digit, i) => (
        <OtpDigitInput
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
        />
      ))}
    </div>
  );
};

const OtpDigitInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="text"
    inputMode="numeric"
    maxLength={1}
    className={cn(
      "rounded-16 border-border bg-card text-foreground flex h-18 w-15 items-center justify-center border text-center font-serif text-[2rem] font-semibold transition-all",
      "focus:border-primary focus:ring-primary/10 focus:ring-4 focus:outline-none",
      className,
    )}
    {...props}
  />
));
OtpDigitInput.displayName = "OtpDigitInput";
