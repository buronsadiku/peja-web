"use client";

import { Dialog, VisuallyHidden } from "radix-ui";
import { forwardRef } from "react";
import { cn } from "../utils/cn";

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;
const SheetPortal = Dialog.Portal;

const SheetOverlay = forwardRef<
  React.ComponentRef<typeof Dialog.Overlay>,
  React.ComponentProps<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn(
      "bg-foreground/30 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-50 backdrop-blur-sm",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

type SheetContentProps = React.ComponentProps<typeof Dialog.Content> & {
  side?: "top" | "right" | "bottom" | "left";
};

const SheetContent = forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Dialog.Content
      ref={ref}
      className={cn(
        "bg-card fixed z-50 flex flex-col gap-4 shadow-lg",
        side === "left" &&
          "border-border inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[state=open]:animate-sheet-slide-in-left data-[state=closed]:animate-sheet-slide-out-left",
        side === "right" &&
          "border-border inset-y-0 right-0 h-full w-3/4 max-w-sm border-l transition-transform duration-300 ease-in-out data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
        side === "top" &&
          "border-border inset-x-0 top-0 border-b transition-transform duration-300 ease-in-out data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0",
        side === "bottom" &&
          "border-border inset-x-0 bottom-0 border-t transition-transform duration-300 ease-in-out data-[state=closed]:translate-y-full data-[state=open]:translate-y-0",
        className,
      )}
      {...props}
    >
      {children}
    </Dialog.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex flex-col gap-2 p-4", className)} {...props} />
);

const SheetTitle = forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentProps<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("type-body text-foreground font-semibold", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentProps<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn("type-body-small text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  VisuallyHidden,
};
