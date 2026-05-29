import { describe, expect, it, vi } from "vitest";
import {
  dedupePairingRecommendations,
  loadTopPairingForProduct,
} from "@/lib/pairing/cache-lookup";
import type { PairingCandidate } from "@/lib/pairing/engine";
import * as engine from "@/lib/pairing/engine";

describe("dedupePairingRecommendations", () => {
  it("keeps one row per candidate and tracks also-sources", () => {
    const legent: PairingCandidate = {
      product_id: "b1",
      name: "Legent",
      brand: "Legent",
      type: "bourbon",
      score: 90,
      reasons: [],
    };
    const entries = dedupePairingRecommendations([
      {
        source: { id: "c1", name: "Mayflower Dusk", brand: null, type: "cigar" },
        candidate: legent,
      },
      {
        source: { id: "c2", name: "Nica Rustica Adobe", brand: null, type: "cigar" },
        candidate: { ...legent, score: 85 },
      },
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0].source.name).toBe("Mayflower Dusk");
    expect(entries[0].alsoSources).toEqual(["Nica Rustica Adobe"]);
  });
});

describe("loadTopPairingForProduct", () => {
  it("returns cached row without calling loadOrComputeTopPairings", async () => {
    const compute = vi.spyOn(engine, "loadOrComputeTopPairings");

    const supabase = {
      from: (table: string) => {
        if (table === "products") {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: { type: "cigar" } }),
              }),
            }),
          };
        }
        if (table === "pairings_cache") {
          return {
            select: () => ({
              eq: () => ({
                order: () => ({
                  limit: async () => ({
                    data: [
                      {
                        bourbon_id: "b1",
                        score: 88,
                        bourbon: { name: "Weller 12", brand: "Buffalo Trace" },
                      },
                    ],
                  }),
                }),
              }),
            }),
          };
        }
        throw new Error(`unexpected table ${table}`);
      },
    };

    const result = await loadTopPairingForProduct(
      supabase as unknown as Parameters<typeof loadTopPairingForProduct>[0],
      "cigar-1",
    );

    expect(result?.product_id).toBe("b1");
    expect(compute).not.toHaveBeenCalled();
    compute.mockRestore();
  });
});
