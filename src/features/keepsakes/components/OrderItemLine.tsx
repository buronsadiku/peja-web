type OrderItemLineProps = {
  label: string;
  value: string;
};

export const OrderItemLine = ({ label, value }: OrderItemLineProps) => (
  <div className="flex items-baseline justify-between">
    <span className="type-caption text-foreground">{label}</span>
    <span className="type-caption text-muted-foreground">{value}</span>
  </div>
);
