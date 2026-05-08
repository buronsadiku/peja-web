type SettingsLanguageChipProps = {
  flag: string;
  label: string;
};

export const SettingsLanguageChip = ({
  flag,
  label,
}: SettingsLanguageChipProps) => (
  <span className="bg-primary/10 type-caption text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold">
    <span className="type-body-small">{flag}</span>
    {label}
    <span className="cursor-pointer opacity-60">&times;</span>
  </span>
);
