type KioskConfigCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export const KioskConfigCard = ({
  title,
  description,
  children,
}: KioskConfigCardProps) => (
  <div className="rounded-16 border-border bg-card border px-7">
    <div className="border-border border-b py-4">
      <div className="type-h3 font-semibold">{title}</div>
      <div className="type-caption text-muted-foreground mt-0.5">
        {description}
      </div>
    </div>
    {children}
  </div>
);
