import { FooterLink } from "./FooterLink";

type FooterColumnLink = {
  label: string;
  href: string;
};

type FooterColumnProps = {
  col: { title: string; links: FooterColumnLink[] };
};

export const FooterColumn = ({ col }: FooterColumnProps) => (
  <div>
    <div className="text-muted-foreground type-overline mb-3.5 font-bold tracking-widest uppercase">
      {col.title}
    </div>
    <div className="flex flex-col gap-2.5">
      {col.links.map((link) => (
        <FooterLink key={link.href} label={link.label} href={link.href} />
      ))}
    </div>
  </div>
);
