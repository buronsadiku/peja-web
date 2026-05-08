type ForPlannersBenefitProps = {
  title: string;
  body: string;
};

export const ForPlannersBenefit = ({ title, body }: ForPlannersBenefitProps) => (
  <div className="border-border rounded-16 bg-card border p-6">
    <p className="type-body font-semibold">{title}</p>
    <p className="text-muted-foreground type-body-small mt-2 leading-relaxed">{body}</p>
  </div>
);
