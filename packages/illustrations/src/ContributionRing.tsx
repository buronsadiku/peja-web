type ContributionRingIllustrationProps = {
  pct: number;
  centerLabel: string;
  ringLabel: string;
};

export const ContributionRingIllustration = ({
  pct,
  centerLabel,
  ringLabel,
}: ContributionRingIllustrationProps) => {
  const r = 56;
  const c = 2 * Math.PI * r;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="10"
      />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform="rotate(-90 70 70)"
      />
      <text
        x="70"
        y="66"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="30"
        fontWeight="600"
        fill="var(--foreground)"
      >
        {centerLabel}
      </text>
      <text
        x="70"
        y="86"
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="600"
        fill="var(--muted-foreground)"
        letterSpacing="1.5"
      >
        {ringLabel}
      </text>
    </svg>
  );
};
