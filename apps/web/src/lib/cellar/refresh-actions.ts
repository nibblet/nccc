"use server";

import { ensureCellarInsight, type CellarInsight } from "@/lib/cellar/insight";
import { ensureTasteRecommendations } from "@/lib/taste/load";
import type { TasteRecommendations } from "@/lib/taste/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadCellarProducts } from "./load";

export async function refreshCellarInsightAction(): Promise<CellarInsight | null> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  return ensureCellarInsight(supabase, auth.user.id);
}

export async function refreshTasteRecommendationsAction(): Promise<TasteRecommendations> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { cigars: [], bourbons: [], signal_hash: "", generated_at: new Date().toISOString() };
  }
  return ensureTasteRecommendations(supabase, auth.user.id);
}

export async function loadCellarTabProductsAction(
  filter: "have" | "want" | "tried",
): Promise<
  Array<{
    product_id: string;
    name: string;
    brand: string | null;
    type: string;
    image_url: string | null;
  }>
> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  return loadCellarProducts(supabase, auth.user.id, filter);
}
