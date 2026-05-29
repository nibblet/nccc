"use client";

import { useEffect, useState } from "react";
import { CellarInsightCard } from "@/components/cellar/cellar-insight-card";
import { CellarInsightSkeleton } from "@/components/cellar/cellar-insight-skeleton";
import type { CellarInsight } from "@/lib/cellar/insight";
import { refreshCellarInsightAction } from "@/lib/cellar/refresh-actions";

type CellarInsightSectionClientProps = {
  initialInsight: CellarInsight | null;
  stale: boolean;
};

export function CellarInsightSectionClient({
  initialInsight,
  stale,
}: CellarInsightSectionClientProps) {
  const [insight, setInsight] = useState(initialInsight);
  const [refreshing, setRefreshing] = useState(stale && !initialInsight);

  useEffect(() => {
    if (!stale) return;
    let cancelled = false;
    setRefreshing(true);
    refreshCellarInsightAction()
      .then((next) => {
        if (!cancelled && next) setInsight(next);
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [stale]);

  if (refreshing && !insight) return <CellarInsightSkeleton />;
  if (!insight) return null;

  return (
    <>
      {refreshing ? (
        <p className="text-[11px] text-foreground-subtle mb-2 italic">Updating…</p>
      ) : null}
      <CellarInsightCard insight={insight} />
    </>
  );
}
