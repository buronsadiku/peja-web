import { cn } from "../utils/cn";
import { Badge } from "./Badge";
import { Card } from "./Card";

type StepCardProps = {
  number: string;
  numberClassName?: string;
  tag: string;
  title: string;
  body: string;
  illustration: React.ReactNode;
  className?: string;
};

export const StepCard = ({
  number,
  numberClassName = "text-primary",
  tag,
  title,
  body,
  illustration,
  className,
}: StepCardProps) => (
  <Card
    className={cn(
      "bg-background tablet:p-8 relative flex min-h-110 flex-col gap-5 overflow-hidden rounded-3xl p-4 shadow-none",
      className,
    )}
  >
    <div className="flex items-center justify-between gap-4">
      <span
        className={cn(
          "type-h2 tablet:type-h1 font-serif leading-none font-semibold italic",
          numberClassName,
        )}
      >
        {number}
      </span>
      <Badge variant="outline" className="uppercase">
        {tag}
      </Badge>
    </div>

    <div className="flex h-40 items-center justify-center">{illustration}</div>

    <div className="mt-auto">
      <h3 className="type-h3 tablet:type-h2 font-serif font-semibold">
        {title}
      </h3>
      <p className="text-muted-foreground type-body-small mt-3">{body}</p>
    </div>
  </Card>
);
