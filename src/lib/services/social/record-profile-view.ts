/**
 * Phase 10.5 — Record profile view (lightweight analytics).
 * Fire-and-forget; does not block user flow.
 */

import { recordActivityEvent } from "./record-activity-event";

/**
 * Record that a user viewed another user's profile.
 * No-op when viewer is signed out or when viewing own profile.
 */
export function recordProfileView(
  viewerUserId: string | null,
  viewedUserId: string
): void {
  const viewer = viewerUserId?.trim();
  const viewed = viewedUserId?.trim();
  if (!viewer || !viewed || viewer === viewed) return;

  recordActivityEvent({
    userId: viewer,
    type: "profile_viewed",
    metadata: { viewedUserId: viewed },
  }).catch(() => {});
}
