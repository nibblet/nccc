import type { SupabaseClient } from "@supabase/supabase-js";
import { loadOrComputeTopPairings, type PairingCandidate } from "@/lib/pairing/engine";
import type { ProductType } from "@/lib/wheel";

/**
 * Read the top cached opposite-type match for a source product; compute only
 * on cache miss. Works for cigar or bourbon sources.
 */
export async function loadTopPairingForProduct(
  supabase: SupabaseClient,
  sourceProductId: string,
  options: { minScore?: number } = {},
): Promise<PairingCandidate | null> {
  const { data: source } = await supabase
    .from("products")
    .select("type")
    .eq("id", sourceProductId)
    .maybeSingle();

  if (!source?.type) return null;
  const sourceType = source.type as ProductType;

  if (sourceType === "cigar") {
    const { data } = await supabase
      .from("pairings_cache")
      .select("bourbon_id, score, bourbon:bourbon_id(name, brand)")
      .eq("cigar_id", sourceProductId)
      .order("score", { ascending: false })
      .limit(1);

    const row = ((data as unknown as Array<{
      bourbon_id: string;
      score: number;
      bourbon: { name: string; brand: string | null } | null;
    }> | null) ?? [])[0];

    if (row?.bourbon) {
      return {
        product_id: row.bourbon_id,
        name: row.bourbon.name,
        brand: row.bourbon.brand,
        type: "bourbon",
        score: row.score,
        reasons: [],
      };
    }
  } else {
    const { data } = await supabase
      .from("pairings_cache")
      .select("cigar_id, score, cigar:cigar_id(name, brand)")
      .eq("bourbon_id", sourceProductId)
      .order("score", { ascending: false })
      .limit(1);

    const row = ((data as unknown as Array<{
      cigar_id: string;
      score: number;
      cigar: { name: string; brand: string | null } | null;
    }> | null) ?? [])[0];

    if (row?.cigar) {
      return {
        product_id: row.cigar_id,
        name: row.cigar.name,
        brand: row.cigar.brand,
        type: "cigar",
        score: row.score,
        reasons: [],
      };
    }
  }

  const computed = await loadOrComputeTopPairings(supabase, sourceProductId, {
    limit: 1,
    minScore: options.minScore,
  });
  return computed[0] ?? null;
}

/** @deprecated Use loadTopPairingForProduct — kept for daily-pour call sites. */
export async function loadTopPairingForCigar(
  supabase: SupabaseClient,
  cigarId: string,
): Promise<PairingCandidate | null> {
  return loadTopPairingForProduct(supabase, cigarId);
}

export const PAIRINGS_INDEX_LIMIT = 8;

export type PairingRecommendationEntry = {
  source: { id: string; name: string; brand: string | null; type: ProductType };
  candidate: PairingCandidate;
};

type TastingRow = {
  product_id: string;
  product: {
    id: string;
    name: string;
    brand: string | null;
    type: ProductType;
  } | null;
};

/**
 * Top pairing per recommended product — parallel, cache-first, capped for index.
 */
export async function loadPairingRecommendations(
  supabase: SupabaseClient,
  userId: string,
): Promise<PairingRecommendationEntry[]> {
  const { data: tastingsRaw } = await supabase
    .from("tastings")
    .select("product_id, product:products(id, name, brand, type)")
    .eq("user_id", userId)
    .eq("recommend", true)
    .order("created_at", { ascending: false })
    .limit(PAIRINGS_INDEX_LIMIT);

  const tastings = (tastingsRaw as unknown as TastingRow[] | null) ?? [];

  const entries = await Promise.all(
    tastings.map(async (t): Promise<PairingRecommendationEntry | null> => {
      if (!t.product) return null;
      const top = await loadTopPairingForProduct(supabase, t.product.id);
      if (!top) return null;
      return { source: t.product, candidate: top };
    }),
  );

  return entries.filter((e): e is PairingRecommendationEntry => e !== null);
}

/** Dedupe by candidate product id — keeps highest-scoring source per match. */
export function dedupePairingRecommendations(
  entries: PairingRecommendationEntry[],
): Array<PairingRecommendationEntry & { alsoSources?: string[] }> {
  const byCandidate = new Map<
    string,
    PairingRecommendationEntry & { alsoSources: string[] }
  >();

  for (const entry of entries) {
    const key = entry.candidate.product_id;
    const existing = byCandidate.get(key);
    if (!existing) {
      byCandidate.set(key, { ...entry, alsoSources: [] });
      continue;
    }
    if (entry.candidate.score > existing.candidate.score) {
      byCandidate.set(key, {
        ...entry,
        alsoSources: [...existing.alsoSources, existing.source.name],
      });
    } else {
      existing.alsoSources.push(entry.source.name);
    }
  }

  return [...byCandidate.values()].sort((a, b) => b.candidate.score - a.candidate.score);
}
