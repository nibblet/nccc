import Link from "next/link";
import { Suspense } from "react";
import { Winston } from "@/components/brand";
import { AppShell } from "@/components/layout/app-shell";
import { PairingsSkeleton } from "@/components/pairing/pairings-skeleton";
import {
  Button,
  Card,
  Divider,
  interactiveCardClassName,
  Voice,
  validatedCardClassName,
} from "@/components/primitives";
import {
  dedupePairingRecommendations,
  loadPairingRecommendations,
} from "@/lib/pairing/cache-lookup";
import { loadCachedPairingProse } from "@/lib/pairing/prose-cache";
import { pairingTierLabel } from "@/lib/pairing/tier";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/lib/wheel";

type ValidatedCacheRow = {
  cigar_id: string;
  bourbon_id: string;
  score: number;
  rationale_text: string | null;
  cigar: { name: string; brand: string | null } | null;
  bourbon: { name: string; brand: string | null } | null;
};

export default async function PairingsIndexPage() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;

  const recommendCount = userId
    ? ((
        await supabase
          .from("tastings")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("recommend", true)
      ).count ?? 0)
    : 0;

  const { data: validatedRaw } = await supabase
    .from("pairings_cache")
    .select(
      "cigar_id, bourbon_id, score, rationale_text, cigar:cigar_id(name, brand), bourbon:bourbon_id(name, brand)",
    )
    .eq("is_group_validated", true)
    .order("score", { ascending: false })
    .limit(10);
  const validated = (validatedRaw as unknown as ValidatedCacheRow[] | null) ?? [];

  return (
    <AppShell>
      <header className="text-center mb-6 flex flex-col items-center">
        <Winston variant="bust" size={64} className="mb-2 rounded-full" />
        <h1 className="text-3xl">Pairings</h1>
        <p className="text-sm tracking-widest uppercase text-foreground-subtle mt-1">
          Winston's matches
        </p>
      </header>

      <Link href="/pairings/capture" className="block mb-6">
        <Button variant="secondary" size="large" className="w-full">
          Capture a pairing
        </Button>
      </Link>

      {validated.length > 0 ? (
        <>
          <Divider label="Club-validated" />
          <div className="flex flex-col gap-3 mb-6">
            {validated.map((v) => (
              <ValidatedCard key={`${v.cigar_id}:${v.bourbon_id}`} entry={v} />
            ))}
          </div>
        </>
      ) : null}

      <Suspense fallback={<PairingsSkeleton />}>
        <PersonalPairingsSection userId={userId} recommendCount={recommendCount} />
      </Suspense>

      <p className="mt-8 text-xs text-foreground-subtle text-center">
        Pairings sharpen as you and the club log more.
      </p>
    </AppShell>
  );
}

async function PersonalPairingsSection({
  userId,
  recommendCount,
}: {
  userId: string | null;
  recommendCount: number;
}) {
  const supabase = await createSupabaseServerClient();
  const raw = userId ? await loadPairingRecommendations(supabase, userId) : [];
  const recommendations = dedupePairingRecommendations(raw);

  const withProse = await Promise.all(
    recommendations.map(async (entry) => {
      const cigarId = entry.source.type === "cigar" ? entry.source.id : entry.candidate.product_id;
      const bourbonId =
        entry.source.type === "bourbon" ? entry.source.id : entry.candidate.product_id;
      const cached = await loadCachedPairingProse(supabase, cigarId, bourbonId);
      return { ...entry, cached_prose: cached?.notes ?? null };
    }),
  );

  const hasContent = withProse.length > 0;
  const recommendedButNoPairs = !hasContent && recommendCount > 0;

  if (!hasContent) {
    return (
      <Card className="text-center">
        {recommendedButNoPairs ? (
          <>
            <Voice className="block mb-3">
              "I've got the names but not the measure of these yet. A few more notes and the matches
              will come."
            </Voice>
            <Link href="/" className="text-sm text-accent hover:text-accent-hover underline">
              Back to the lounge →
            </Link>
          </>
        ) : (
          <>
            <Voice className="block mb-3">
              "Recommend a cigar or a pour first — I work from what you've actually tasted."
            </Voice>
            <Link href="/capture" className="text-sm text-accent hover:text-accent-hover underline">
              Open the humidor →
            </Link>
          </>
        )}
      </Card>
    );
  }

  return (
    <>
      <Divider label="From your tastings" />
      <div className="flex flex-col gap-4">
        {withProse.map((r) => (
          <RecommendationCard
            key={`${r.source.id}:${r.candidate.product_id}`}
            entry={r}
          />
        ))}
      </div>
    </>
  );
}

function ValidatedCard({ entry }: { entry: ValidatedCacheRow }) {
  if (!entry.cigar || !entry.bourbon) return null;
  return (
    <Link href={`/pairings/${entry.cigar_id}/${entry.bourbon_id}`} className="block group">
      <div className={cn(validatedCardClassName, "px-4 py-4")}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[10px] uppercase tracking-widest text-moss-600">● club tried</p>
          <p className="text-[10px] uppercase tracking-widest text-foreground-subtle">
            {pairingTierLabel(entry.score)}
          </p>
        </div>
        <p className="text-base text-foreground mt-1 truncate group-hover:text-accent transition-colors">
          {entry.cigar.name}
        </p>
        <p className="text-[11px] tracking-widest uppercase text-foreground-subtle my-1.5">
          paired with
        </p>
        <p className="text-base text-foreground truncate group-hover:text-accent transition-colors">
          {entry.bourbon.name}
        </p>
        {entry.rationale_text ? (
          <p className="text-sm text-foreground-muted italic mt-2 line-clamp-2">
            "{entry.rationale_text}"
          </p>
        ) : null}
      </div>
    </Link>
  );
}

type RecommendationEntry = {
  source: { id: string; name: string; brand: string | null; type: ProductType };
  candidate: {
    product_id: string;
    name: string;
    brand: string | null;
    score: number;
    reasons: Array<{ reason: string }>;
  };
  cached_prose: string | null;
  alsoSources?: string[];
};

function RecommendationCard({ entry }: { entry: RecommendationEntry }) {
  const { source, candidate } = entry;
  const cigarId = source.type === "cigar" ? source.id : candidate.product_id;
  const bourbonId = source.type === "bourbon" ? source.id : candidate.product_id;
  const prose = entry.cached_prose ?? candidate.reasons[0]?.reason;

  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-foreground-subtle mb-1.5">
        You recommended <span className="text-foreground">{source.name}</span>
        {entry.alsoSources && entry.alsoSources.length > 0 ? (
          <span className="text-foreground-muted normal-case tracking-normal">
            {" "}
            · also matches your {entry.alsoSources.join(", ")}
          </span>
        ) : null}
      </p>
      <Link href={`/pairings/${cigarId}/${bourbonId}`} className="block group">
        <div className={cn(interactiveCardClassName, "px-4 py-4")}>
          <div className="flex items-baseline justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-foreground-subtle">
                Winston suggests
              </p>
              <p className="text-base text-foreground truncate mt-0.5 group-hover:text-accent transition-colors">
                {candidate.name}
              </p>
              {candidate.brand ? (
                <p className="text-xs text-foreground-muted truncate">{candidate.brand}</p>
              ) : null}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-foreground-subtle shrink-0">
              {pairingTierLabel(candidate.score)}
            </p>
          </div>
          {prose ? (
            <p className="text-sm text-foreground-muted italic mt-2 line-clamp-2">"{prose}"</p>
          ) : null}
        </div>
      </Link>
    </div>
  );
}
