import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type ShareChannelProps = {
  label: string;
  color: string;
  Icon: IconComponent;
} & (
  | { href: string; onClick?: never }
  | { href?: never; onClick: () => void }
);

const channelClass =
  "rounded-12 border-border bg-background hover:bg-muted flex cursor-pointer flex-col items-center gap-1.5 border p-3 transition-colors";

export const ShareChannel = ({
  label,
  color,
  Icon,
  href,
  onClick,
}: ShareChannelProps) => {
  const content = (
    <>
      <span
        className="rounded-10 text-primary-foreground flex size-9 items-center justify-center"
        style={{ background: color }}
      >
        <Icon width={18} height={18} strokeWidth={1.7} />
      </span>
      <span className="type-caption text-foreground font-semibold">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={channelClass}
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={channelClass}>
      {content}
    </button>
  );
};
