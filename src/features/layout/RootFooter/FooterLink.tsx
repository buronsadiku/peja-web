import { Link } from "@/i18n/navigation";

type FooterLinkProps = {
  label: string;
  href: string;
};

export const FooterLink = ({ label, href }: FooterLinkProps) => (
  <Link href={href} className="text-foreground hover:text-primary text-sm transition-colors">
    {label}
  </Link>
);
