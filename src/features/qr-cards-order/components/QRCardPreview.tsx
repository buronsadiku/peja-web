type QRCardPreviewProps = {
  coupleName?: string;
  date?: string;
  url?: string;
  cardColor?: string;
  className?: string;
};

export const QRCardPreview = ({
  coupleName = "Lena & Tomás",
  date = "14 · VI · 2026",
  url = "peja.love/lena-and-tomas",
  cardColor,
  className,
}: QRCardPreviewProps) => (
  <div
    className={
      "rounded-12 flex aspect-[220/320] flex-col justify-between p-5 shadow-lg " +
      (className ?? "")
    }
    style={{ background: cardColor ?? "#F9F7F4" }}
  >
    <div>
      <p className="type-overline text-muted-foreground tracking-widest">
        The Wedding of
      </p>
      <p className="type-h3 mt-1.5 font-medium tracking-tight italic">
        {coupleName}
      </p>
      <p className="type-caption text-muted-foreground mt-1.5 font-mono">
        {date}
      </p>
    </div>

    <div className="flex justify-center">
      <div
        className="rounded-8 grid aspect-square w-1/2 grid-cols-8 gap-px p-2"
        style={{ background: "#2D2D2D" }}
      >
        {Array.from({ length: 64 }).map((_, i) => {
          const litCells = [
            0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 13, 14, 15, 19, 22, 28, 33, 41, 48,
            49, 50, 52, 54, 55, 56, 57, 63,
          ];
          const isLit = litCells.includes(i);
          return (
            <div
              key={i}
              style={{ background: isLit ? "#fff" : "#2D2D2D" }}
            />
          );
        })}
      </div>
    </div>

    <div className="text-center">
      <p className="type-overline text-muted-foreground tracking-widest">
        Leave a message
      </p>
      <p className="type-caption text-foreground mt-1 font-mono">{url}</p>
    </div>
  </div>
);
