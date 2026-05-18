export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-muted animate-pulse rounded-lg ${className ?? ""}`} />
);

export const SkeletonGrid = ({
  count,
  className,
  itemClass,
}: {
  count: number;
  className?: string;
  itemClass?: string;
}) => (
  <div
    className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className ?? ""}`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton
        key={i}
        className={itemClass ?? "h-64 rounded-2xl"}
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden">
    <Skeleton className="h-48 rounded-none" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
      />
    ))}
  </div>
);
