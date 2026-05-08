type FeaturePillProps = {
  label: string;
};

export const FeaturePill = ({ label }: FeaturePillProps) => (
  <span className="type-caption rounded-full bg-white/50 px-2.5 py-1.5 font-semibold">
    {label}
  </span>
);
