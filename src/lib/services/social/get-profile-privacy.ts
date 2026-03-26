/**
 * Phase 10.1 — Fetch current user's privacy settings.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { getProfileVisibility } from "./is-profile-visible";
import type { ProfilePrivacySettings } from "@/types/social";

export type GetProfilePrivacyResult =
  | { ok: true; settings: ProfilePrivacySettings }
  | { ok: false; error: string };

/**
 * Get privacy settings for the current user.
 */
export async function getProfilePrivacy(
  supabase: SupabaseClient,
  userId: string
): Promise<GetProfilePrivacyResult> {
  const uid = userId?.trim();
  if (!uid) return { ok: false, error: "userId required" };

  const vis = await getProfileVisibility(supabase, uid);
  if (!vis) return { ok: false, error: "Profile not found" };

  const settings: ProfilePrivacySettings = {
    isPublicProfile: vis.isPublic,
    allowActivityFeed: vis.allowActivityFeed,
    allowLeaderboard: vis.allowLeaderboard,
  };

  return { ok: true, settings };
}
