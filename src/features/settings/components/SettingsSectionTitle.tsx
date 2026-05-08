type SettingsSectionTitleProps = {
  title: string;
  description?: string;
};

export const SettingsSectionTitle = ({
  title,
  description,
}: SettingsSectionTitleProps) => (
  <div className="mb-5">
    <h2 className="type-h2 tracking-tight">{title}</h2>
    {description && (
      <p className="type-body-small text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
        {description}
      </p>
    )}
  </div>
);
