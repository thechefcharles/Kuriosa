/**
 * Phase 10.1 — Privacy-aware profile visibility.
 * Use before returning profiles or activity for social features.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type VisibilityCheck = {
  isPublic: boolean;
  allowActivityFeed: boolean;
  allowLeaderboard: boolean;
};

/**
 * Load privacy flags for a user. Returns null if profile not found.
 */
export async function getProfileVisibility(
  supabase: SupabaseClient,
  userId: string
): Promise<VisibilityCheck | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("is_public_profile, allow_activity_feed, allow_leaderboard")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    isPublic: Boolean(data.is_public_profile),
    allowActivityFeed: Boolean(data.allow_activity_feed),
    allowLeaderboard: Boolean(data.allow_leaderboard),
  };
}

/**
 * Check if a profile can be shown publicly (e.g. profile page, leaderboard).
 */
export async function isProfileVisible(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const vis = await getProfileVisibility(supabase, userId);
  return vis?.isPublic ?? false;
}
