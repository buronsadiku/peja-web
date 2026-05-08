import { cn } from "@peja/ui/utils/cn";

type SectionTitleProps = {
  as?: "h1" | "h2" | "h3" | "blockquote";
  children: React.ReactNode;
  className?: string;
};

export const SectionTitle = ({
  as: Tag = "h2",
  children,
  className,
}: SectionTitleProps) => (
  <Tag
    className={cn(
      "type-h0 tablet:type-display leading-tight font-semibold tracking-tight",
      className,
    )}
  >
    {children}
  </Tag>
);
