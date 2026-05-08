type SettingsFieldProps = {
  label: string;
  value?: string;
  hint?: string;
  adornmentRight?: React.ReactNode;
  children?: React.ReactNode;
};

export const SettingsField = ({
  label,
  value,
  hint,
  adornmentRight,
  children,
}: SettingsFieldProps) => (
  <label className="block">
    <span className="type-caption text-muted-foreground mb-2 block font-semibold tracking-wide">
      {label}
    </span>
    {children ?? (
      <div className="rounded-12 border-border bg-card type-body-small flex items-center gap-2.5 border px-3.5 py-3">
        <span className="flex-1">{value}</span>
        {adornmentRight}
      </div>
    )}
    {hint && (
      <span className="type-caption text-muted-foreground mt-1.5 block leading-relaxed">
        {hint}
      </span>
    )}
  </label>
);
