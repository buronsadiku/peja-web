"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-lg py-4 font-semibold transition focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        ghost: "hover:bg-muted text-foreground",
        destructive: "bg-danger text-primary-foreground hover:bg-danger/90",
        outline:
          "ring-primary bg-card text-primary hover:bg-primary hover:text-primary-foreground ring-2 ring-inset",
      },
      size: {
        default: "h-10 gap-2 px-4 text-sm",
        lg: "h-12 gap-2 px-6 text-base",
        sm: "h-8 gap-1 px-3 text-xs",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
export { buttonVariants };
