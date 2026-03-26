/**
 * Phase 10.2 — Client-side share logic (native share + copy fallback).
 */

import { getTopicShareMetadata } from "./get-topic-share-metadata";
import type { TopicShareMetadataInput } from "./get-topic-share-metadata";
import type { ShareChannel } from "./record-share-event";
import { fetchApiWithOptionalAuth } from "@/lib/network/fetch-api-session";

export type ShareResult =
  | { ok: true; channel: ShareChannel }
  | { ok: false; error: string };

function recordShareAnalytics(
  topicId: string,
  channel: ShareChannel
): void {
  fetchApiWithOptionalAuth("/api/social/record-share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topicId, channel }),
  }).catch(() => {});
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator?.clipboard?.writeText !== "function") return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Share a curiosity topic. Tries native share first, falls back to copy.
 */
export async function shareTopic(
  input: TopicShareMetadataInput & { topicId: string }
): Promise<ShareResult> {
  const slug = input.slug?.trim();
  const topicId = input.topicId?.trim();

  if (!slug) {
    return { ok: false, error: "Topic slug is required" };
  }

  const metadata = getTopicShareMetadata(input);

  if (typeof navigator?.share === "function") {
    try {
      await navigator.share({
        title: metadata.title,
        text: metadata.shareText,
        url: metadata.shareUrl,
      });
      recordShareAnalytics(topicId || "", "native_share");
      return { ok: true, channel: "native_share" };
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") {
        return { ok: false, error: "Share cancelled" };
      }
    }
  }

  const copied = await copyToClipboard(metadata.shareUrl);
  if (copied) {
    recordShareAnalytics(topicId || "", "copy_link");
    return { ok: true, channel: "copy_link" };
  }

  return { ok: false, error: "Could not copy link" };
}
