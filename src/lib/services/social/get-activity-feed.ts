/**
 * Phase 10.4 — Activity feed for UI.
 * Enriches events with display names, topic titles, badge names.
 */

import { getActivityEvents } from "./get-activity-events";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import type { ActivityFeedItemView } from "@/types/activity-feed";

export type GetActivityFeedInput = {
  limit?: number;
  offset?: number;
  userId?: string | null;
};

export type GetActivityFeedResult =
  | { ok: true; items: ActivityFeedItemView[] }
  | { ok: false; error: string };

/**
 * Get recent activity feed items, enriched for display.
 */
export async function getActivityFeed(
  input: GetActivityFeedInput = {}
): Promise<GetActivityFeedResult> {
  const result = await getActivityEvents({
    limit: input.limit,
    offset: input.offset,
    userId: input.userId,
  });

  if (!result.ok) return result;
  const events = result.events;
  if (events.length === 0) return { ok: true, items: [] };

  const supabase = getSupabaseServiceRoleClient();
  const userIds = [...new Set(events.map((e) => e.userId))];
  const topicIds = [...new Set(events.map((e) => e.topicId).filter(Boolean))] as string[];
  const badgeIds = [
    ...new Set(
      events
        .map((e) => e.metadata?.badgeId as string | undefined)
        .filter(Boolean)
    ),
  ] as string[];

  const [profilesRes, topicsRes, badgesRes] = await Promise.all([
    userIds.length
      ? supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", userIds)
      : Promise.resolve({ data: [] }),
    topicIds.length
      ? supabase
          .from("topics")
          .select("id, title, slug")
          .in("id", topicIds)
      : Promise.resolve({ data: [] }),
    badgeIds.length
      ? supabase
          .from("badges")
          .select("id, name")
          .in("id", badgeIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profileMap = new Map(
    (profilesRes.data ?? []).map((p: { id: string; display_name: string | null }) => [
      p.id,
      p.display_name?.trim() || null,
    ])
  );
  const topicMap = new Map(
    (topicsRes.data ?? []).map((t: { id: string; title: string; slug: string }) => [
      t.id,
      { title: t.title, slug: t.slug },
    ])
  );
  const badgeMap = new Map(
    (badgesRes.data ?? []).map((b: { id: string; name: string }) => [b.id, b.name])
  );

  const items: ActivityFeedItemView[] = events.map((e) => {
    const topic = e.topicId ? topicMap.get(e.topicId) : null;
    const badgeName = e.metadata?.badgeId
      ? badgeMap.get(String(e.metadata.badgeId)) ?? null
      : null;
    return {
      id: e.id,
      userId: e.userId,
      displayName: profileMap.get(e.userId) ?? null,
      type: e.type,
      topicId: e.topicId,
      topicTitle: topic?.title ?? null,
      topicSlug: topic?.slug ?? null,
      badgeName,
      metadata: e.metadata,
      createdAt: e.createdAt,
    };
  });

  return { ok: true, items };
}
