export function CellarInsightSkeleton() {
  return (
    <div
      className="mb-5 rounded-[16px] border border-border bg-surface p-4 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Loading shelf insight"
    >
      <div className="h-3 bg-surface-2 rounded w-32 mb-3" />
      <div className="h-3 bg-surface-2 rounded w-16 mb-2" />
      <div className="space-y-2">
        <div className="h-4 bg-surface-2 rounded w-full" />
        <div className="h-4 bg-surface-2 rounded w-4/5" />
      </div>
    </div>
  );
}
