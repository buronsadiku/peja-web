type QRBlockProps = {
  size?: number;
  dark?: string;
  light?: string;
  withLogo?: boolean;
};

type FinderPatternProps = {
  cx: number;
  cy: number;
  cell: number;
  dark: string;
  light: string;
};

const FinderPattern = ({ cx, cy, cell, dark, light }: FinderPatternProps) => (
  <>
    <rect x={cx} y={cy} width={7 * cell} height={7 * cell} fill={dark} />
    <rect
      x={cx + cell}
      y={cy + cell}
      width={5 * cell}
      height={5 * cell}
      fill={light}
    />
    <rect
      x={cx + 2 * cell}
      y={cy + 2 * cell}
      width={3 * cell}
      height={3 * cell}
      fill={dark}
    />
  </>
);

export const QRBlock = ({
  size = 240,
  dark = "#2D2D2D",
  light = "#fff",
  withLogo = true,
}: QRBlockProps) => {
  const cell = size / 24;
  const seed = 1723;

  const dots: boolean[] = [];
  for (let y = 0; y < 24; y++) {
    for (let x = 0; x < 24; x++) {
      dots.push((x * 31 + y * 53 + seed) % 7 < 3);
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
    >
      <rect width={size} height={size} fill={light} />
      {dots.map((on, i) => {
        const x = i % 24;
        const y = Math.floor(i / 24);
        if ((x < 8 && y < 8) || (x > 15 && y < 8) || (x < 8 && y > 15))
          return null;
        if (!on) return null;
        return (
          <rect
            key={i}
            x={x * cell}
            y={y * cell}
            width={cell}
            height={cell}
            fill={dark}
            rx={cell * 0.15}
          />
        );
      })}
      <FinderPattern cx={0} cy={0} cell={cell} dark={dark} light={light} />
      <FinderPattern
        cx={17 * cell}
        cy={0}
        cell={cell}
        dark={dark}
        light={light}
      />
      <FinderPattern
        cx={0}
        cy={17 * cell}
        cell={cell}
        dark={dark}
        light={light}
      />
      {withLogo && (
        <>
          <rect
            x={size / 2 - cell * 2.5}
            y={size / 2 - cell * 2.5}
            width={cell * 5}
            height={cell * 5}
            fill={light}
            rx={cell}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={cell * 1.8}
            fill="var(--primary)"
          />
          <text
            x={size / 2}
            y={size / 2 + cell * 0.7}
            textAnchor="middle"
            fontFamily="var(--font-serif, serif)"
            fontSize={cell * 2.2}
            fill="#fff"
            fontWeight="700"
          >
            O
          </text>
        </>
      )}
    </svg>
  );
};
