/**
 * Phase 10.1 — Record activity events for feeds and analytics.
 * Non-blocking; failures must not break user flow.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";

export type RecordActivityEventInput = {
  userId: string;
  type: string;
  topicId?: string | null;
  metadata?: Record<string, unknown> | null;
};

/**
 * Insert an activity event. Fire-and-forget; swallows errors.
 */
export async function recordActivityEvent(
  input: RecordActivityEventInput
): Promise<void> {
  const uid = input.userId?.trim();
  const type = input.type?.trim();

  if (!uid || !type) return;

  try {
    const supabase = getSupabaseServiceRoleClient();
    await supabase.from("activity_events").insert({
      user_id: uid,
      type,
      topic_id: input.topicId ?? null,
      metadata: input.metadata ?? null,
    });
  } catch {
    // Silent; activity must never break user flow
  }
}
