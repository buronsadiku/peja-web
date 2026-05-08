import type { ReactNode } from "react";

type CustomizerSectionProps = {
  title: string;
  description?: string;
  badge?: string;
  children: ReactNode;
};

export const CustomizerSection = ({
  title,
  description,
  badge,
  children,
}: CustomizerSectionProps) => {
  return (
    <section className="rounded-20 border-border bg-card flex flex-col gap-4 border p-6">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="type-h4 font-semibold">{title}</h2>
          {description && (
            <p className="type-body-small text-muted-foreground mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {badge && (
          <span className="type-caption text-muted-foreground tracking-wider">
            {badge}
          </span>
        )}
      </header>
      {children}
    </section>
  );
};
