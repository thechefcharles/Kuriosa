/**
 * Phase 10.1 — Fetch activity events for feeds.
 * Respects allow_activity_feed; no feed ranking yet.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { getProfileVisibility } from "./is-profile-visible";
import type { ActivityEvent } from "@/types/social";

export type GetActivityEventsInput = {
  limit?: number;
  offset?: number;
  userId?: string | null;
};

export type GetActivityEventsResult =
  | { ok: true; events: ActivityEvent[] }
  | { ok: false; error: string };

/**
 * Get recent activity events. Filters out users with allow_activity_feed = false.
 */
export async function getActivityEvents(
  input: GetActivityEventsInput = {}
): Promise<GetActivityEventsResult> {
  const limit = Math.min(input.limit ?? 50, 100);
  const offset = input.offset ?? 0;

  try {
    const supabase = getSupabaseServiceRoleClient();

    let query = supabase
      .from("activity_events")
      .select("id, user_id, type, topic_id, metadata, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (input.userId) {
      query = query.eq("user_id", input.userId);
    }

    const { data: rows, error } = await query;

    if (error) return { ok: false, error: error.message };

    const events = (rows ?? []) as Array<{
      id: string;
      user_id: string;
      type: string;
      topic_id: string | null;
      metadata: unknown;
      created_at: string;
    }>;

    const userIds = [...new Set(events.map((e) => e.user_id))];
    const visibilityMap = new Map<string, boolean>();
    for (const uid of userIds) {
      const vis = await getProfileVisibility(supabase, uid);
      visibilityMap.set(uid, vis?.allowActivityFeed ?? false);
    }

    const filtered = events.filter((e) => visibilityMap.get(e.user_id));

    return {
      ok: true,
      events: filtered.map((e) => ({
        id: e.id,
        userId: e.user_id,
        type: e.type,
        topicId: e.topic_id,
        metadata: e.metadata as Record<string, unknown> | null,
        createdAt: e.created_at,
      })),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}
