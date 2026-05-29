"use client";

import { startTransition, useCallback, useEffect, useOptimistic, useState } from "react";
import { setCellarState } from "@/lib/cellar/actions";
import type { CellarFilterCounts } from "@/lib/cellar/load";
import { loadCellarTabProductsAction } from "@/lib/cellar/refresh-actions";
import { PickPourButton } from "@/components/feed";
import { Voice } from "@/components/primitives";
import { cn } from "@/lib/utils";

type CellarFilter = "have" | "want" | "tried";
type TypeFilter = "all" | "cigar" | "bourbon";

type CellarProduct = {
  product_id: string;
  name: string;
  brand: string | null;
  type: string;
  image_url: string | null;
};

type CellarTabProps = {
  have: CellarProduct[];
  counts: CellarFilterCounts;
  isOwnProfile: boolean;
  memberFirstName: string;
};

function defaultTypeFilter(products: CellarProduct[]): TypeFilter {
  const cigarCount = products.filter((p) => p.type === "cigar").length;
  const bourbonCount = products.filter((p) => p.type === "bourbon").length;
  if (cigarCount > 0 && bourbonCount > 0 && cigarCount < bourbonCount) return "cigar";
  return "all";
}

export function CellarTab({ have, counts, isOwnProfile, memberFirstName }: CellarTabProps) {
  const [filter, setFilter] = useState<CellarFilter>("have");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(() => defaultTypeFilter(have));
  const [lists, setLists] = useState<Record<CellarFilter, CellarProduct[]>>({
    have,
    want: [],
    tried: [],
  });
  const [loadedTabs, setLoadedTabs] = useState<Set<CellarFilter>>(() => new Set(["have"]));
  const [loadingTab, setLoadingTab] = useState<CellarFilter | null>(null);

  const [removedIds, setRemovedIds] = useOptimistic<
    Record<string, Set<string>>,
    { filter: CellarFilter; productId: string }
  >({} as Record<string, Set<string>>, (prev, { filter: f, productId }) => {
    const next = new Set(prev[f]);
    next.add(productId);
    return { ...prev, [f]: next };
  });

  const loadTab = useCallback(async (tab: CellarFilter) => {
    if (tab === "have" || loadedTabs.has(tab)) return;
    setLoadingTab(tab);
    try {
      const products = await loadCellarTabProductsAction(tab);
      setLists((prev) => ({ ...prev, [tab]: products }));
      setLoadedTabs((prev) => new Set(prev).add(tab));
    } finally {
      setLoadingTab(null);
    }
  }, [loadedTabs]);

  useEffect(() => {
    if (filter !== "have") void loadTab(filter);
  }, [filter, loadTab]);

  const visibleList = lists[filter]
    .filter((p) => !removedIds[filter]?.has(p.product_id))
    .filter((p) => typeFilter === "all" || p.type === typeFilter);

  const typeFilteredList = lists[filter].filter(
    (p) => !removedIds[filter]?.has(p.product_id),
  );
  const cigarCount = typeFilteredList.filter((p) => p.type === "cigar").length;
  const bourbonCount = typeFilteredList.filter((p) => p.type === "bourbon").length;
  const hasBothTypes = cigarCount > 0 && bourbonCount > 0;

  const emptyMessages: Record<CellarFilter, string> = {
    have: isOwnProfile
      ? '"The shelf is bare. Add what you\'re pouring tonight."'
      : `"${memberFirstName} hasn't stocked the shelf yet."`,
    want: isOwnProfile
      ? '"Nothing on the wishlist yet. Tap Want on any product to start one."'
      : `"${memberFirstName}'s wishlist is empty."`,
    tried: isOwnProfile
      ? '"No history yet. Recommend something to NCCC and it will appear here."'
      : `"${memberFirstName} hasn't marked anything as tried yet."`,
  };

  const hasHaveItems = counts.have >= 1;

  function handleRemove(productId: string) {
    startTransition(() => {
      setRemovedIds({ filter, productId });
      setCellarState(productId, { [filter]: false });
    });
  }

  const tabCounts: Record<CellarFilter, number> = {
    have: counts.have,
    want: counts.want,
    tried: counts.tried,
  };

  return (
    <div>
      {isOwnProfile && hasHaveItems ? (
        <div className="mb-4">
          <PickPourButton variant="primary" label="Pick for me →" />
        </div>
      ) : null}

      {isOwnProfile && !hasHaveItems ? (
        <Voice className="block mb-4 text-sm">
          "Stock the cellar first — then I'll pick from what you have."
        </Voice>
      ) : null}

      <div className="flex items-center gap-2 mb-3">
        {(["have", "want", "tried"] as CellarFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-[12px] tracking-wide capitalize transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              filter === f
                ? "bg-accent-tint text-foreground border border-accent"
                : "bg-surface text-foreground-muted border border-border hover:bg-surface-2",
            )}
          >
            {f}{" "}
            {tabCounts[f] > 0 ? (
              <span className="ml-1 text-foreground-subtle">{tabCounts[f]}</span>
            ) : null}
          </button>
        ))}
      </div>

      {hasBothTypes ? (
        <div className="flex items-center gap-1.5 mb-4">
          {([
            { key: "all" as TypeFilter, label: "All" },
            { key: "cigar" as TypeFilter, label: `Cigars ${cigarCount}` },
            { key: "bourbon" as TypeFilter, label: `Bourbons ${bourbonCount}` },
          ]).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTypeFilter(key)}
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[11px] tracking-wide transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                typeFilter === key
                  ? "bg-surface-2 text-foreground border border-border"
                  : "text-foreground-subtle hover:text-foreground-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {loadingTab === filter ? (
        <p className="text-sm text-foreground-subtle italic text-center py-4">Loading…</p>
      ) : visibleList.length === 0 ? (
        <p className="text-sm text-foreground-subtle italic text-center py-4">
          {typeFilter !== "all"
            ? `No ${typeFilter === "cigar" ? "cigars" : "bourbons"} in this list.`
            : emptyMessages[filter]}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleList.map((p) => (
            <div
              key={p.product_id}
              className="flex items-center gap-3 rounded-[12px] border border-border bg-surface px-3.5 py-2.5 hover:bg-surface-2 transition-colors"
            >
              <a
                href={`/products/${p.product_id}`}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                {p.image_url ? (
                  // biome-ignore lint/performance/noImgElement: public catalog URL, no signing needed
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-9 h-9 rounded-lg object-contain bg-surface-2 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-surface-2 shrink-0 flex items-center justify-center text-[10px] text-foreground-subtle uppercase tracking-widest">
                    {p.type === "cigar" ? "🚬" : "🥃"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[11px] text-foreground-muted truncate">
                    {p.brand ?? ""}
                    {p.brand ? " · " : ""}
                    <span className="uppercase tracking-widest text-foreground-subtle">
                      {p.type}
                    </span>
                  </p>
                </div>
              </a>
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => handleRemove(p.product_id)}
                  className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-foreground-subtle hover:text-foreground hover:bg-surface-2 transition-colors touch-manipulation"
                  aria-label={`Remove from ${filter}`}
                  title={`Remove from ${filter}`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 4l6 6M10 4l-6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
