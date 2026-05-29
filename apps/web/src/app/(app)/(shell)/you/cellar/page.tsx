import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CellarInsightSectionClient } from "@/components/cellar/cellar-insight-section";
import { CellarInsightSkeleton } from "@/components/cellar/cellar-insight-skeleton";
import { TryNextSectionClient } from "@/components/cellar/try-next-section";
import { TryNextSkeleton } from "@/components/cellar/try-next-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { CellarSection } from "@/components/members/sections";
import { Divider } from "@/components/primitives";
import { loadCachedInsight, loadCurrentHaveHash } from "@/lib/cellar/insight";
import { formatMemberName, type MemberNameFields } from "@/lib/identity";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  loadCachedTasteRecommendations,
  loadCurrentTasteSignalHash,
} from "@/lib/taste/load";

export default async function YouCellarPage() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("name_first, name_last_initial")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (!profile) redirect("/login");

  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-sm tracking-widest uppercase text-foreground-subtle">
          {formatMemberName(profile as MemberNameFields)}
        </p>
        <h1 className="text-3xl mt-1">Your cellar</h1>
      </header>

      <Suspense fallback={<CellarInsightSkeleton />}>
        <CellarInsightSection memberId={auth.user.id} />
      </Suspense>

      <Suspense fallback={<TryNextSkeleton />}>
        <TryNextSection memberId={auth.user.id} />
      </Suspense>

      <Divider label="The shelf" />

      <CellarSection
        memberId={auth.user.id}
        memberFirstName={profile.name_first}
        isOwnProfile={true}
      />
    </AppShell>
  );
}

async function CellarInsightSection({ memberId }: { memberId: string }) {
  const supabase = await createSupabaseServerClient();
  const [cached, currentHash] = await Promise.all([
    loadCachedInsight(supabase, memberId),
    loadCurrentHaveHash(supabase, memberId),
  ]);
  if (!currentHash) return null;
  const stale = !cached || cached.have_hash !== currentHash;
  return <CellarInsightSectionClient initialInsight={cached} stale={stale} />;
}

async function TryNextSection({ memberId }: { memberId: string }) {
  const supabase = await createSupabaseServerClient();
  const [cached, currentHash] = await Promise.all([
    loadCachedTasteRecommendations(supabase, memberId),
    loadCurrentTasteSignalHash(supabase, memberId),
  ]);
  const stale = !cached || cached.signal_hash !== currentHash;
  return (
    <TryNextSectionClient
      initialCigars={cached?.cigars ?? []}
      initialBourbons={cached?.bourbons ?? []}
      stale={stale}
    />
  );
}
