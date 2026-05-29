export function TryNextSkeleton() {
  return (
    <section
      className="mb-5 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Loading try next picks"
    >
      <div className="h-4 bg-surface-2 rounded w-full mb-4" />
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-[12px] border border-border bg-surface px-3.5 py-2.5"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-2 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-surface-2 rounded w-20" />
              <div className="h-4 bg-surface-2 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
