"use client";

import { useEffect, useState } from "react";
import { TryNext } from "@/components/cellar/try-next";
import { TryNextSkeleton } from "@/components/cellar/try-next-skeleton";
import { Divider } from "@/components/primitives";
import { refreshTasteRecommendationsAction } from "@/lib/cellar/refresh-actions";
import type { TryNextPick } from "@/lib/taste";

type TryNextSectionClientProps = {
  initialCigars: TryNextPick[];
  initialBourbons: TryNextPick[];
  stale: boolean;
};

export function TryNextSectionClient({
  initialCigars,
  initialBourbons,
  stale,
}: TryNextSectionClientProps) {
  const [cigars, setCigars] = useState(initialCigars);
  const [bourbons, setBourbons] = useState(initialBourbons);
  const hasInitial = initialCigars.length > 0 || initialBourbons.length > 0;
  const [refreshing, setRefreshing] = useState(stale && !hasInitial);

  useEffect(() => {
    if (!stale) return;
    let cancelled = false;
    setRefreshing(true);
    refreshTasteRecommendationsAction()
      .then((next) => {
        if (cancelled) return;
        setCigars(next.cigars);
        setBourbons(next.bourbons);
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [stale]);

  if (refreshing && !hasInitial) {
    return (
      <>
        <Divider label="Try next" />
        <TryNextSkeleton />
      </>
    );
  }

  if (cigars.length === 0 && bourbons.length === 0) return null;

  return (
    <>
      <Divider label="Try next" />
      {refreshing ? (
        <p className="text-[11px] text-foreground-subtle mb-2 italic -mt-2">Updating…</p>
      ) : null}
      <TryNext cigars={cigars} bourbons={bourbons} />
    </>
  );
}
