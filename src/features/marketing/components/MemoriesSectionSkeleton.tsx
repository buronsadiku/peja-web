import { SkeletonGrid } from "@/features/layout/Skeleton";

export const MemoriesSectionSkeleton = () => (
  <section className="py-24 px-4 bg-card">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <div className="h-14 w-64 mx-auto bg-muted animate-pulse rounded-lg" />
        <div className="w-24 h-2 bg-muted/60 mx-auto rounded" />
        <div className="h-5 w-80 mx-auto bg-muted animate-pulse rounded" />
      </div>
      <SkeletonGrid count={8} className="mb-12" />
    </div>
  </section>
);
