type OrderDetailRowProps = {
  label: string;
  value: React.ReactNode;
};

export const OrderDetailRow = ({ label, value }: OrderDetailRowProps) => (
  <div className="flex items-baseline justify-between">
    <span className="type-caption text-muted-foreground">{label}</span>
    <span className="type-body-small text-foreground font-semibold capitalize">
      {value}
    </span>
  </div>
);
