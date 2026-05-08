"use client";

import { forwardRef } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "../utils/cn";

type CheckboxProps = Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  "onChange" | "onCheckedChange" | "checked"
> & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
};

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ checked, onChange, label, className, ...props }, ref) => {
  const root = (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checked}
      onCheckedChange={(value) => onChange?.(value === true)}
      className={cn(
        "border-border bg-card data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:ring-ring rounded-6 size-[18px] shrink-0 cursor-pointer border-[1.5px] transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label) return root;

  return (
    <label className="flex items-start gap-2.5 text-left">
      {root}
      <span className="type-body-small text-muted-foreground leading-snug">
        {label}
      </span>
    </label>
  );
});
Checkbox.displayName = "Checkbox";
