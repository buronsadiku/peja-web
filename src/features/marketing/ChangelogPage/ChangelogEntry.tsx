type ChangelogEntryProps = {
  version: string;
  date: string;
  description: string;
};

export const ChangelogEntry = ({ version, date, description }: ChangelogEntryProps) => (
  <div className="border-border border-b py-8 last:border-b-0">
    <div className="flex flex-wrap items-baseline gap-3">
      <span className="type-body font-semibold">{version}</span>
      <span className="text-muted-foreground type-body-small">{date}</span>
    </div>
    <p className="text-muted-foreground type-body mt-3 max-w-prose leading-relaxed">{description}</p>
  </div>
);
