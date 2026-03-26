/**
 * Phase 10.2 — Record share events (topic_shared) for lightweight analytics.
 * Reuses activity_events; non-blocking. Skipped when userId is null (signed-out shares).
 */

import { recordActivityEvent } from "./record-activity-event";

export type ShareChannel = "copy_link" | "native_share" | "external_unknown";

export type RecordShareEventInput = {
  userId: string | null;
  topicId: string;
  channel: ShareChannel;
  metadata?: Record<string, unknown> | null;
};

/**
 * Record a topic_shared event. Fire-and-forget; no-op when userId is null.
 */
export async function recordShareEvent(
  input: RecordShareEventInput
): Promise<void> {
  if (!input.userId?.trim()) return;

  await recordActivityEvent({
    userId: input.userId,
    type: "topic_shared",
    topicId: input.topicId,
    metadata: {
      channel: input.channel,
      ...(input.metadata ?? {}),
    },
  });
}
