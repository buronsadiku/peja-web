import { cn } from "@peja/ui/utils/cn";
import { DecorativeBlob } from "./DecorativeBlob";

type SplitLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
  blobScale?: number;
  className?: string;
};

export const SplitLayout = ({
  left,
  right,
  blobScale = 1,
  className,
}: SplitLayoutProps) => {
  const topSize = Math.round(320 * blobScale);
  const bottomSize = Math.round(260 * blobScale);

  return (
    <div
      className={cn(
        "desktop:grid-cols-[40%_1fr] grid min-h-[calc(100vh-89px)]",
        className,
      )}
    >
      <div className="from-primary to-primary/80 text-primary-foreground desktop:flex desktop:items-center desktop:justify-center relative hidden overflow-hidden bg-gradient-to-br">
        <div className="dark:bg-background/90 pointer-events-none absolute inset-0" />
        <DecorativeBlob
          className="-top-20 -right-20"
          color="destructive"
          size={topSize}
        />
        <DecorativeBlob
          className="-bottom-15 -left-10"
          color="accent"
          size={bottomSize}
        />
        <div className="relative flex w-full max-w-110 flex-col gap-10 p-16">
          {left}
        </div>
      </div>
      <div className="tablet:px-18 flex items-center px-6 py-16">
        <div className="w-full max-w-130">{right}</div>
      </div>
    </div>
  );
};
