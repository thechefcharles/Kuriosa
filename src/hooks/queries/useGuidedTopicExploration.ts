"use client";

import { useQuery } from "@tanstack/react-query";
import { aiExplorationQueryKeys } from "@/lib/query/query-keys";
import type {
  GuidedTopicExplorationResult,
  TopicAIContext,
  TopicRabbitHoleItem,
} from "@/types/ai";

type TopicExplorationInput = { slug?: string; topicId?: string };

async function fetchTopicExploration(
  input: TopicExplorationInput
): Promise<GuidedTopicExplorationResult> {
  const params = new URLSearchParams();
  if (input.slug) params.set("slug", input.slug);
  if (input.topicId) params.set("topicId", input.topicId);

  const res = await fetch(`/api/ai/topic-exploration?${params}`, {
    credentials: "same-origin",
  });

  const json = (await res.json()) as GuidedTopicExplorationResult;

  if (!res.ok) {
    const errMsg =
      json && typeof json === "object" && "error" in json && typeof (json as { error?: unknown }).error === "string"
        ? (json as { error: string }).error
        : "Failed to load exploration";
    throw new Error(errMsg);
  }

  return json;
}

export type GuidedTopicExplorationData = {
  topicContext: TopicAIContext;
  followups: string[];
  followupsFromStorage: boolean;
  rabbitHoles: TopicRabbitHoleItem[];
  rabbitHolesFromCache: boolean;
};

export function useGuidedTopicExploration(input: TopicExplorationInput) {
  const key = input.slug ?? input.topicId ?? "";

  return useQuery({
    queryKey: aiExplorationQueryKeys.topicExploration(key),
    queryFn: () => fetchTopicExploration(input),
    enabled: Boolean(key),
    select: (result): GuidedTopicExplorationData | null => {
      if (!result.ok) return null;
      return {
        topicContext: result.topicContext,
        followups: result.followups,
        followupsFromStorage: result.followupsFromStorage,
        rabbitHoles: result.rabbitHoles,
        rabbitHolesFromCache: result.rabbitHolesFromCache,
      };
    },
  });
}
