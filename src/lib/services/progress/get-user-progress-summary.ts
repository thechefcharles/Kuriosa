import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProgressSummary } from "@/types/progress-view";
import {
  cumulativeXpForLevel,
  getLevelFromXP,
  getXPForNextLevel,
  xpRequiredToAdvanceFromLevel,
} from "@/lib/progress/level-config";

function buildSummaryFromProfileRow(row: {
  total_xp: number;
  curiosity_score: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}): UserProgressSummary {
  const totalXP = Math.max(0, Math.floor(Number(row.total_xp) || 0));
  const level = getLevelFromXP(totalXP);
  const xpIntoCurrentLevel = totalXP - cumulativeXpForLevel(level);
  const xpRequiredForCurrentLevel = xpRequiredToAdvanceFromLevel(level);
  const currentLevelProgress =
    xpRequiredForCurrentLevel > 0
      ? Math.min(1, xpIntoCurrentLevel / xpRequiredForCurrentLevel)
      : 1;

  return {
    totalXP,
    currentLevel: level,
    currentLevelProgress,
    xpIntoCurrentLevel,
    xpRequiredForCurrentLevel,
    nextLevelXP: getXPForNextLevel(totalXP),
    curiosityScore: Math.floor(Number(row.curiosity_score) || 0),
    streak: {
      currentStreak: Math.max(0, Math.floor(Number(row.current_streak) || 0)),
      longestStreak: Math.max(0, Math.floor(Number(row.longest_streak) || 0)),
      lastActiveDate: row.last_active_date,
    },
  };
}

/**
 * Profile progress fields → UserProgressSummary (level derived from total_xp).
 */
export async function getUserProgressSummary(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProgressSummary | null> {
  const uid = userId.trim();
  if (!uid) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "total_xp, curiosity_score, current_streak, longest_streak, last_active_date"
    )
    .eq("id", uid)
    .maybeSingle();

  if (error || !data) return null;
  return buildSummaryFromProfileRow(
    data as {
      total_xp: number;
      curiosity_score: number;
      current_streak: number;
      longest_streak: number;
      last_active_date: string | null;
    }
  );
}
