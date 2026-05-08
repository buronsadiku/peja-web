import { cn } from "../utils/cn";
import { Card } from "./Card";

type StatCardProps = {
  value: string;
  label: string;
  className?: string;
};

export const StatCard = ({ value, label, className }: StatCardProps) => (
  <Card className={cn("p-4.5", className)}>
    <p className="type-h1 font-serif leading-none font-semibold">{value}</p>
    <p className="type-caption mt-0.5 opacity-80">{label}</p>
  </Card>
);
