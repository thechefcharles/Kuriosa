/**
 * Phase 10.3 — Leaderboard read service.
 * Weekly/monthly: aggregate from user_topic_history.
 * All-time: profiles.curiosity_score, total_xp, topics explored.
 * Respects allow_leaderboard.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { getLevelFromXP } from "@/lib/progress/level-config";
import { getLeaderboardWindowRange } from "./leaderboard-window";
import type { LeaderboardWindow } from "@/types/leaderboard";
import type { LeaderboardEntryView, LeaderboardSummaryView } from "@/types/leaderboard";

export type GetLeaderboardOptions = {
  limit?: number;
  offset?: number;
  currentUserId?: string | null;
  refDate?: Date;
};

/**
 * Get ranked leaderboard entries for a window.
 */
export async function getLeaderboard(
  window: LeaderboardWindow,
  options: GetLeaderboardOptions = {}
): Promise<LeaderboardSummaryView> {
  const limit = Math.min(options.limit ?? 50, 100);
  const offset = options.offset ?? 0;
  const currentUserId = options.currentUserId?.trim() || null;
  const refDate = options.refDate ?? new Date();

  const supabase = getSupabaseServiceRoleClient();
  const range = getLeaderboardWindowRange(window, refDate);

  const { data: eligibleProfiles, error: profErr } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, curiosity_score, total_xp")
    .eq("is_public_profile", true)
    .eq("allow_leaderboard", true);

  if (profErr || !eligibleProfiles?.length) {
    return {
      window,
      entries: [],
      totalEligible: 0,
      windowStart: range?.start.toISOString() ?? null,
      windowEnd: range?.end.toISOString() ?? null,
    };
  }

  const eligibleIds = eligibleProfiles.map((p) => p.id);
  const profileMap = new Map(
    eligibleProfiles.map((p) => [
      p.id,
      {
        displayName: p.display_name?.trim() || null,
        avatarUrl: p.avatar_url?.trim() || null,
        curiosityScore: Number(p.curiosity_score) ?? 0,
        totalXp: Number(p.total_xp) ?? 0,
      },
    ])
  );

  let entries: LeaderboardEntryView[] = [];

  if (window === "all_time") {
    const topicCounts = new Map<string, number>();
    const { data: hist } = await supabase
      .from("user_topic_history")
      .select("user_id")
      .in("user_id", eligibleIds)
      .not("completed_at", "is", null);

    for (const row of hist ?? []) {
      const uid = row.user_id;
      topicCounts.set(uid, (topicCounts.get(uid) ?? 0) + 1);
    }

    entries = eligibleProfiles
      .map((p) => {
        const meta = profileMap.get(p.id)!;
        const topicsExplored = topicCounts.get(p.id) ?? 0;
        return {
          userId: p.id,
          displayName: meta.displayName,
          avatarUrl: meta.avatarUrl,
          curiosityScore: meta.curiosityScore,
          totalXp: meta.totalXp,
          level: getLevelFromXP(meta.totalXp),
          topicsExplored,
          score: meta.curiosityScore,
        };
      })
      .filter((e) => e.curiosityScore > 0 || e.totalXp > 0 || e.topicsExplored > 0)
      .sort((a, b) => {
        if (b.curiosityScore !== a.curiosityScore)
          return b.curiosityScore - a.curiosityScore;
        if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;
        if (b.topicsExplored !== a.topicsExplored)
          return b.topicsExplored - a.topicsExplored;
        return (a.displayName ?? a.userId).localeCompare(
          b.displayName ?? b.userId
        );
      })
      .map((e, i) => ({
        ...e,
        rank: i + 1,
        score: e.curiosityScore,
        isCurrentUser: currentUserId === e.userId,
      }));
  } else if (range) {
    const { data: hist } = await supabase
      .from("user_topic_history")
      .select("user_id, xp_earned")
      .in("user_id", eligibleIds)
      .eq("rewards_granted", true)
      .not("completed_at", "is", null)
      .gte("completed_at", range.start.toISOString())
      .lte("completed_at", range.end.toISOString());

    const agg = new Map<
      string,
      { xp: number; completions: number }
    >();
    for (const row of hist ?? []) {
      const uid = row.user_id;
      const xp = Number(row.xp_earned) ?? 0;
      const cur = agg.get(uid) ?? { xp: 0, completions: 0 };
      agg.set(uid, {
        xp: cur.xp + xp,
        completions: cur.completions + 1,
      });
    }

    const withCompletions = Array.from(agg.entries())
      .map(([userId, { xp, completions }]) => {
        const meta = profileMap.get(userId);
        if (!meta) return null;
        return { userId, meta, xp, completions };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    withCompletions.sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      return b.completions - a.completions;
    });

    entries = withCompletions.map((e, i) => ({
      userId: e.userId,
      displayName: e.meta.displayName,
      avatarUrl: e.meta.avatarUrl,
      rank: i + 1,
      score: e.xp,
      isCurrentUser: currentUserId === e.userId,
    }));
  }

  const totalEligible = entries.length;
  const paginated = entries.slice(offset, offset + limit);

  return {
    window,
    entries: paginated,
    totalEligible,
    windowStart: range?.start.toISOString() ?? null,
    windowEnd: range?.end.toISOString() ?? null,
  };
}
