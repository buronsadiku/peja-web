type KeepsakeCardProps = {
  name: string;
  description: string;
  price: string;
};

export const KeepsakeCard = ({ name, description, price }: KeepsakeCardProps) => (
  <div className="border-border rounded-16 bg-card flex flex-col border p-6">
    <p className="type-body font-semibold">{name}</p>
    <p className="text-muted-foreground type-body-small mt-2 flex-1 leading-relaxed">{description}</p>
    <p className="text-primary type-body mt-4 font-semibold">{price}</p>
  </div>
);
