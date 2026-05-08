import { cn } from "@peja/ui/utils/cn";

type SettingsRadioProps = {
  on: boolean;
  color?: "primary" | "destructive";
};

export const SettingsRadio = ({
  on,
  color = "primary",
}: SettingsRadioProps) => {
  const ring = color === "primary" ? "border-primary" : "border-destructive";
  const dot = color === "primary" ? "bg-primary" : "bg-destructive";

  return (
    <div
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
        on ? ring : "border-border",
      )}
    >
      {on && <div className={cn("size-2.5 rounded-full", dot)} />}
    </div>
  );
};
