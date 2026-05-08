import { cn } from "@peja/ui/utils/cn";

type GuestStatCardProps = {
  value: number;
  label: string;
  sub: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone: "primary" | "destructive" | "accent" | "muted";
};

const toneBg: Record<GuestStatCardProps["tone"], string> = {
  primary: "bg-primary/15",
  destructive: "bg-destructive/15",
  accent: "bg-accent/15",
  muted: "bg-muted",
};

const toneText: Record<GuestStatCardProps["tone"], string> = {
  primary: "text-primary",
  destructive: "text-destructive",
  accent: "text-accent-foreground",
  muted: "text-muted-foreground",
};

export const GuestStatCard = ({
  value,
  label,
  sub,
  icon: Icon,
  tone,
}: GuestStatCardProps) => {
  return (
    <div className="rounded-16 border-border bg-card relative border p-5">
      <div
        className={cn(
          "rounded-10 absolute top-4.5 right-4.5 flex size-8 items-center justify-center",
          toneBg[tone],
        )}
      >
        <Icon width={15} height={15} className={toneText[tone]} />
      </div>
      <div className="font-serif text-4xl leading-none font-semibold tracking-tight">
        {value}
      </div>
      <div className="type-body-small mt-2 font-semibold">{label}</div>
      <div className="type-caption text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
};
