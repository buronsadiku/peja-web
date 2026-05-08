import { cn } from "@peja/ui/utils/cn";

type QRTabButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export const QRTabButton = ({ label, active, onClick }: QRTabButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "type-caption cursor-pointer rounded-full px-3.5 py-1.5 font-semibold transition-colors",
      active
        ? "bg-card text-foreground"
        : "text-primary-foreground bg-white/15 hover:bg-white/25",
    )}
  >
    {label}
  </button>
);
