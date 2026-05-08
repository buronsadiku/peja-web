import { cn } from "@peja/ui/utils/cn";
import { QRBlock } from "@peja/illustrations/QRBlock";

type StyleOptionProps = {
  label: string;
  dark: string;
  light: string;
  active: boolean;
  onClick: () => void;
};

export const StyleOption = ({
  label,
  dark,
  light,
  active,
  onClick,
}: StyleOptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className="cursor-pointer text-center"
  >
    <div
      className={cn(
        "rounded-10 flex items-center justify-center p-2 transition-all",
        active
          ? "border-primary shadow-input border-2"
          : "border-border border",
      )}
      style={{ background: light }}
    >
      <QRBlock size={56} dark={dark} light={light} withLogo={false} />
    </div>
    <p
      className={cn(
        "type-caption mt-1.5",
        active ? "text-foreground font-semibold" : "text-muted-foreground",
      )}
    >
      {label}
    </p>
  </button>
);
