import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserBadgeView } from "@/types/progress-view";

/**
 * All badges earned by the user, newest first.
 */
export async function getUserBadges(
  supabase: SupabaseClient,
  userId: string
): Promise<UserBadgeView[]> {
  const uid = userId.trim();
  if (!uid) return [];

  const { data: ubRows, error: ubErr } = await supabase
    .from("user_badges")
    .select("badge_id, earned_at")
    .eq("user_id", uid)
    .order("earned_at", { ascending: false });

  if (ubErr || !ubRows?.length) return [];

  const badgeIds = [...new Set(ubRows.map((r) => String(r.badge_id)))];
  const { data: defs, error: bErr } = await supabase
    .from("badges")
    .select("id, slug, name, description, icon")
    .in("id", badgeIds);

  if (bErr || !defs?.length) return [];

  const byId = new Map(
    defs.map((b) => [
      String((b as { id: string }).id),
      b as {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        icon: string | null;
      },
    ])
  );

  const out: UserBadgeView[] = [];
  for (const row of ubRows) {
    const bid = String(row.badge_id);
    const b = byId.get(bid);
    if (!b) continue;
    out.push({
      badgeId: bid,
      slug: String(b.slug),
      name: String(b.name),
      description: b.description != null ? String(b.description) : null,
      icon: b.icon != null ? String(b.icon) : null,
      earnedAt: String(row.earned_at),
    });
  }
  return out;
}
