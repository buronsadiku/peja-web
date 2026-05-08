import { cn } from "@peja/ui/utils/cn";
import { DownloadIcon } from "@peja/icons/DownloadIcon";

type FormatRowProps = {
  ext: string;
  desc: string;
  size: string;
  primary: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export const FormatRow = ({
  ext,
  desc,
  size,
  primary,
  onClick,
  disabled,
}: FormatRowProps) => (
  <div
    className={cn(
      "rounded-12 border-border bg-background flex items-center gap-3 border p-3",
      disabled && !onClick && "opacity-60",
    )}
  >
    <div
      className={cn(
        "rounded-8 type-caption flex size-10 items-center justify-center font-bold tracking-wider",
        primary
          ? "bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground border",
      )}
    >
      {ext}
    </div>
    <div className="min-w-0 flex-1">
      <p className="type-body-small font-semibold">{ext}</p>
      <p className="type-caption text-muted-foreground">
        {desc} &middot; {size}
      </p>
    </div>
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-8.5 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        !disabled && "cursor-pointer",
        primary
          ? "bg-primary text-primary-foreground shadow-primary/35 shadow-md"
          : "border-border bg-card text-foreground hover:bg-muted border",
      )}
    >
      <DownloadIcon width={15} height={15} strokeWidth={1.7} />
    </button>
  </div>
);
