/**
 * Phase 10.1 — Update profile settings (display name, avatar, bio, privacy).
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type UpdateProfileSettingsInput = {
  userId: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  isPublicProfile?: boolean;
  allowActivityFeed?: boolean;
  allowLeaderboard?: boolean;
};

export type UpdateProfileSettingsResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Update profile fields. Validates display_name length (2–40) when provided.
 */
export async function updateProfileSettings(
  supabase: SupabaseClient,
  input: UpdateProfileSettingsInput
): Promise<UpdateProfileSettingsResult> {
  const uid = input.userId?.trim();
  if (!uid) return { ok: false, error: "userId required" };

  const updates: Record<string, unknown> = {};
  updates.updated_at = new Date().toISOString();

  if (input.displayName !== undefined) {
    const v = input.displayName?.trim();
    if (v !== null && v !== undefined) {
      if (v === "" || v.length < 2 || v.length > 40) {
        return { ok: false, error: "displayName must be 2–40 characters" };
      }
    }
    updates.display_name = v ?? null;
  }

  if (input.avatarUrl !== undefined) updates.avatar_url = input.avatarUrl?.trim() ?? null;
  if (input.bio !== undefined) updates.bio = input.bio?.trim() ?? null;
  if (input.isPublicProfile !== undefined) updates.is_public_profile = input.isPublicProfile;
  if (input.allowActivityFeed !== undefined) updates.allow_activity_feed = input.allowActivityFeed;
  if (input.allowLeaderboard !== undefined) updates.allow_leaderboard = input.allowLeaderboard;

  if (Object.keys(updates).length <= 1) return { ok: true };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", uid);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
