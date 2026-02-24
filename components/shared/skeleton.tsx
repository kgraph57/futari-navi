import clsx from "clsx";

interface SkeletonProps {
  readonly className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg bg-ivory-200",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  readonly lines?: number;
  readonly className?: string;
}) {
  return (
    <div className={clsx("space-y-3", className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={clsx(
            "h-4",
            i === lines - 1 ? "w-2/3" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-border bg-card p-7",
        className,
      )}
      aria-hidden="true"
    >
      <Skeleton className="mb-3 h-5 w-20" />
      <Skeleton className="mb-2 h-6 w-3/4" />
      <SkeletonText lines={2} />
      <div className="mt-4 flex gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function SkeletonArticleList({
  count = 6,
  className,
}: {
  readonly count?: number;
  readonly className?: string;
}) {
  return (
    <div
      className={clsx(
        "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
