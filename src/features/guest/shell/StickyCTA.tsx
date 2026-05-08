import type { ReactNode } from "react";
import { cn } from "@peja/ui/utils/cn";

type StickyCTAProps = {
  children: ReactNode;
  caption?: string;
  className?: string;
};

export const StickyCTA = ({ children, caption, className }: StickyCTAProps) => (
  <div
    className={cn(
      "from-background small-desktop:sticky small-desktop:bottom-0 z-10 bg-gradient-to-t to-transparent px-5 pt-9 pb-6 tablet:px-8 small-desktop:px-10",
      className,
    )}
  >
    {children}
    {caption && (
      <p className="type-caption text-muted-foreground mt-2.5 text-center">
        {caption}
      </p>
    )}
  </div>
);
