import type { ComponentType, SVGProps } from "react";
import { ArrowUpRightIcon } from "@peja/icons/ArrowUpRightIcon";

type HelpResourceCardProps = {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  external?: boolean;
};

export const HelpResourceCard = ({
  title,
  description,
  icon: Icon,
  href,
  external,
}: HelpResourceCardProps) => (
  <a
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    className="rounded-16 border-border bg-card hover:border-primary/40 hover:bg-card group flex items-start gap-4 border p-5 transition-colors"
  >
    <div className="bg-primary/10 text-primary rounded-12 inline-flex size-10 shrink-0 items-center justify-center">
      <Icon width={18} height={18} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="type-body-small font-semibold">{title}</span>
        <ArrowUpRightIcon
          width={14}
          height={14}
          className="text-muted-foreground group-hover:text-primary transition-colors"
        />
      </div>
      <p className="type-caption text-muted-foreground mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  </a>
);
