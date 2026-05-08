type StatItemProps = {
  value: string;
  label: string;
};

export const StatItem = ({ value, label }: StatItemProps) => (
  <div>
    <p className="type-h1 leading-none font-semibold">{value}</p>
    <p className="type-body-small text-muted-foreground mt-1.5">{label}</p>
  </div>
);
