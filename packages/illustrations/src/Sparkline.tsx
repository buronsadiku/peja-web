export const Sparkline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="48"
    viewBox="0 0 320 48"
    preserveAspectRatio="none"
    className="block"
    {...props}
  >
    <defs>
      <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 40 L40 34 L80 36 L120 28 L160 24 L200 18 L240 20 L280 10 L320 6 L320 48 L0 48 Z"
      fill="url(#sparkline-fill)"
    />
    <path
      d="M0 40 L40 34 L80 36 L120 28 L160 24 L200 18 L240 20 L280 10 L320 6"
      stroke="var(--primary)"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);
