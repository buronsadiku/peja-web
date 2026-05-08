import { cn } from "@peja/ui/utils/cn";
import { Card } from "@peja/ui/components/Card";
import { Kicker } from "@peja/ui/components/Kicker";

type FeatureCardProps = {
  kicker: string;
  kickerClassName?: string;
  title: React.ReactNode;
  titleClassName?: string;
  className?: string;
  children: React.ReactNode;
};

export const FeatureCard = ({
  kicker,
  kickerClassName,
  title,
  titleClassName,
  className,
  children,
}: FeatureCardProps) => (
  <Card
    className={cn(
      "rounded-24 flex flex-col gap-4 overflow-hidden p-6",
      className,
    )}
  >
    <Kicker className={kickerClassName}>{kicker}</Kicker>
    <p className={cn("type-h3 leading-tight font-semibold", titleClassName)}>
      {title}
    </p>
    {children}
  </Card>
);
