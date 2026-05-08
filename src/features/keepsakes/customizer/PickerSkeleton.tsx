type PickerSkeletonProps = {
  variant: "rows" | "tiles";
  count?: number;
};

export const PickerSkeleton = ({ variant, count = 8 }: PickerSkeletonProps) => {
  const items = Array.from({ length: count }, (_, i) => i);
  if (variant === "tiles") {
    return (
      <div className="mobile:grid-cols-3 tablet:grid-cols-4 desktop:grid-cols-5 grid grid-cols-2 gap-2">
        {items.map((i) => (
          <div
            key={i}
            className="rounded-12 bg-muted aspect-square animate-pulse"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-12 border-border bg-card flex flex-col divide-y divide-(--border) overflow-hidden border">
      {items.map((i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="bg-muted size-4.5 rounded animate-pulse" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="bg-muted h-3 w-32 rounded animate-pulse" />
            <div className="bg-muted h-2.5 w-48 rounded animate-pulse" />
          </div>
          <div className="bg-muted h-3 w-10 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
};
