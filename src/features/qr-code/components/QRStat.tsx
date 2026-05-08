type QRStatProps = {
  value: string;
  label: string;
  positive?: boolean;
};

export const QRStat = ({ value, label, positive }: QRStatProps) => (
  <div>
    <p
      className={`type-h1 font-semibold tracking-tight ${positive ? "text-secondary" : "text-foreground"}`}
    >
      {value}
    </p>
    <p className="type-caption text-muted-foreground mt-0.5">{label}</p>
  </div>
);
