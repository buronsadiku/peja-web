import { cn } from "@peja/ui/utils/cn";

type PolaroidProps = {
  initial: string;
  caption: string;
  background: string;
  className?: string;
};

export const Polaroid = ({
  initial,
  caption,
  background,
  className,
}: PolaroidProps) => (
  <div
    className={cn(
      "bg-card relative h-full w-full p-2.5 pb-9 shadow-lg",
      className,
    )}
  >
    <div
      className="rounded-4 flex h-full w-full items-center justify-center type-display font-semibold tracking-tight text-primary-foreground"
      style={{ background }}
    >
      {initial}
    </div>
    <span className="text-muted-foreground type-caption absolute right-0 bottom-2.5 left-0 text-center font-serif italic">
      {caption}
    </span>
  </div>
);
