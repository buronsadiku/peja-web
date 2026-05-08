type NextStepCardProps = {
  emoji: string;
  title: string;
  description: string;
};

export const NextStepCard = ({
  emoji,
  title,
  description,
}: NextStepCardProps) => (
  <div className="rounded-16 border-border bg-card border p-4.5 shadow-sm">
    <span className="text-xl">{emoji}</span>
    <p className="type-body-small text-foreground mt-2 font-semibold">
      {title}
    </p>
    <p className="type-caption text-muted-foreground mt-1 leading-snug">
      {description}
    </p>
  </div>
);
