/**
 * Phase 10.1 — Fetch public profile view.
 * Respects is_public_profile; returns null when private.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { getLevelFromXP } from "@/lib/progress/level-config";
import { isProfileVisible } from "./is-profile-visible";
import type { PublicProfileView } from "@/types/social";

export type GetPublicProfileInput =
  | { userId: string }
  | { username: string };

export type GetPublicProfileResult =
  | { ok: true; profile: PublicProfileView }
  | { ok: false; error: string; notFound?: boolean };

/**
 * Get public profile by user id or username. Returns null/restricted when private.
 */
export async function getPublicProfile(
  supabase: SupabaseClient,
  input: GetPublicProfileInput
): Promise<GetPublicProfileResult> {
  try {
    let userId: string | null = null;

    if ("userId" in input) {
      userId = input.userId?.trim() || null;
    } else if ("username" in input) {
      const uname = input.username?.trim();
      if (!uname) return { ok: false, error: "Username required" };
      const { data: row } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", uname)
        .maybeSingle();
      userId = row?.id ?? null;
    }

    if (!userId) return { ok: false, error: "User not found", notFound: true };

    const visible = await isProfileVisible(supabase, userId);
    if (!visible) return { ok: false, error: "Profile is private", notFound: false };

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "id, display_name, avatar_url, bio, curiosity_score, total_xp"
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) return { ok: false, error: error.message };
    if (!profile) return { ok: false, error: "Profile not found", notFound: true };

    const { count: topicsCount } = await supabase
      .from("user_topic_history")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("completed_at", "is", null);

    const { count: badgesCount } = await supabase
      .from("user_badges")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const totalXp = Number(profile.total_xp) ?? 0;
    const level = getLevelFromXP(totalXp);

    const view: PublicProfileView = {
      id: profile.id,
      displayName: profile.display_name?.trim() || null,
      avatarUrl: profile.avatar_url?.trim() || null,
      bio: profile.bio?.trim() || null,
      curiosityScore: Number(profile.curiosity_score) ?? 0,
      level,
      badgesCount: badgesCount ?? 0,
      topicsExploredCount: topicsCount ?? 0,
    };

    return { ok: true, profile: view };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}
