import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfileProgressView } from "@/types/progress-view";
import {
  cumulativeXpForLevel,
  getLevelFromXP,
  getXPForNextLevel,
  xpRequiredToAdvanceFromLevel,
} from "@/lib/progress/level-config";

/**
 * Profile identity + UserProgressSummary (single profile read).
 */
export async function getUserProfileProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfileProgressView | null> {
  const uid = userId.trim();
  if (!uid) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, avatar_url, total_xp, curiosity_score, current_streak, longest_streak, last_active_date"
    )
    .eq("id", uid)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    total_xp: number;
    curiosity_score: number;
    current_streak: number;
    longest_streak: number;
    last_active_date: string | null;
  };

  const totalXP = Math.max(0, Math.floor(Number(row.total_xp) || 0));
  const level = getLevelFromXP(totalXP);
  const xpIntoCurrentLevel = totalXP - cumulativeXpForLevel(level);
  const xpRequiredForCurrentLevel = xpRequiredToAdvanceFromLevel(level);
  const currentLevelProgress =
    xpRequiredForCurrentLevel > 0
      ? Math.min(1, xpIntoCurrentLevel / xpRequiredForCurrentLevel)
      : 1;

  return {
    userId: String(row.id),
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    summary: {
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
    },
  };
}
