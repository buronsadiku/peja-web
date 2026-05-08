import { CheckIcon } from "@peja/icons/CheckIcon";
import { cn } from "@peja/ui/utils/cn";

type VerifiedDotProps = {
  ok?: boolean;
};

export const VerifiedDot = ({ ok = true }: VerifiedDotProps) => (
  <span
    className={cn(
      "type-caption inline-flex items-center gap-1.5 font-bold",
      ok ? "text-secondary-foreground" : "text-destructive",
    )}
  >
    <span
      className={cn(
        "flex size-4 items-center justify-center rounded-full",
        ok ? "bg-secondary/30" : "bg-destructive/20",
      )}
    >
      {ok ? (
        <CheckIcon width={10} height={10} strokeWidth={3.5} />
      ) : (
        <span className="type-caption font-bold">!</span>
      )}
    </span>
    {ok ? "Verified" : "Unverified"}
  </span>
);
