import { Divider } from "@/components/primitives";

export function PairingsSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading pairings">
      <Divider label="From your tastings" />
      <div className="flex flex-col gap-4 animate-pulse">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="h-3 bg-surface-2 rounded w-48 mb-2" />
            <div className="rounded-[16px] border border-border bg-surface px-4 py-4 space-y-2">
              <div className="h-3 bg-surface-2 rounded w-24" />
              <div className="h-5 bg-surface-2 rounded w-2/3" />
              <div className="h-4 bg-surface-2 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
