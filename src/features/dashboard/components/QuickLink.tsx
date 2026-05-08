import { Link } from "@/i18n/navigation";
import { ArrowUpRightIcon } from "@peja/icons/ArrowUpRightIcon";

type QuickLinkProps = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const QuickLink = ({ label, href, icon }: QuickLinkProps) => (
  <Link
    href={href}
    className="rounded-10 type-body-small text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 px-3 py-2.5 transition-colors"
  >
    <span className="text-muted-foreground inline-flex">{icon}</span>
    <span className="flex-1">{label}</span>
    <ArrowUpRightIcon width={12} height={12} className="opacity-40" />
  </Link>
);
