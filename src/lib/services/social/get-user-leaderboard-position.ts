/**
 * Phase 10.3 — User position in leaderboard.
 */

import { getLeaderboard } from "./get-leaderboard";
import type { LeaderboardWindow } from "@/types/leaderboard";
import type { UserLeaderboardPosition } from "@/types/leaderboard";

export type GetUserPositionOptions = {
  currentUserId: string;
  refDate?: Date;
};

/**
 * Get the current user's position in a leaderboard window.
 */
export async function getUserLeaderboardPosition(
  window: LeaderboardWindow,
  options: GetUserPositionOptions
): Promise<UserLeaderboardPosition> {
  const { currentUserId, refDate } = options;
  const uid = currentUserId?.trim();
  if (!uid) return null;

  const result = await getLeaderboard(window, {
    limit: 10_000,
    offset: 0,
    currentUserId: uid,
    refDate,
  });

  const entry = result.entries.find((e) => e.userId === uid);
  if (!entry) return null;

  return {
    window,
    rank: entry.rank,
    score: entry.score,
    totalEligible: result.totalEligible,
    entry,
  };
}
