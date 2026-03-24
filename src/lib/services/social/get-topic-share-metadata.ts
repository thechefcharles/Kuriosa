/**
 * Phase 10.2 — Share metadata for curiosity topics.
 * In-app sharing text and metadata; no OG image generation.
 */

import { getShareUrl } from "./get-share-url";

export type TopicShareMetadataInput = {
  slug: string;
  title: string;
  hookQuestion?: string | null;
  shortSummary?: string | null;
};

export type TopicShareMetadata = {
  title: string;
  shareText: string;
  description: string;
  shareUrl: string;
};

/**
 * Build share metadata for a curiosity topic.
 * Share text feels like: "Today I learned why octopuses have three hearts."
 */
export function getTopicShareMetadata(
  input: TopicShareMetadataInput
): TopicShareMetadata {
  const slug = input.slug?.trim();
  const title = input.title?.trim() || "Curiosity";
  const hook = input.hookQuestion?.trim();

  const shareUrl = getShareUrl(slug || "");

  const shareText = hook
    ? `Today I learned ${hook.charAt(0).toLowerCase() + hook.slice(1)}`
    : `Today I learned something curious: ${title}`;

  const snippet = hook || input.shortSummary?.trim() || title;
  const description = snippet ? snippet.slice(0, 160) : "Explore curiosity with Kuriosa";

  return {
    title: `${title} | Kuriosa`,
    shareText,
    description,
    shareUrl,
  };
}
