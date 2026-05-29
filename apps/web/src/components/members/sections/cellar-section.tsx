import { CellarTab } from "@/components/cellar";
import { loadCellarFilterCounts, loadCellarProducts } from "@/lib/cellar/load";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function CellarSection({
  memberId,
  memberFirstName,
  isOwnProfile,
}: {
  memberId: string;
  memberFirstName: string;
  isOwnProfile: boolean;
}) {
  const supabase = await createSupabaseServerClient();
  const [have, counts] = await Promise.all([
    loadCellarProducts(supabase, memberId, "have"),
    loadCellarFilterCounts(supabase, memberId),
  ]);

  return (
    <CellarTab
      have={have}
      counts={counts}
      isOwnProfile={isOwnProfile}
      memberFirstName={memberFirstName}
    />
  );
}
