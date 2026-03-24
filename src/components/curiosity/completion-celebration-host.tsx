"use client";

import { useEffect, useState } from "react";
import {
  consumeCompletionCelebration,
  type CompletionCelebrationPayload,
} from "@/lib/progress/completion-celebration-storage";
import { getSessionCompletionCount } from "@/lib/progress/session-completion-tracker";
import { CompletionCelebrationCard } from "@/components/progress/completion-celebration-card";

/**
 * Shows one-shot celebration after challenge → Continue when payload was stashed for this slug.
 */
export function CompletionCelebrationHost({
  topicSlug,
  onConsumed,
}: {
  topicSlug: string;
  /** Called when a payload was consumed (user just completed challenge) */
  onConsumed?: () => void;
}) {
  const [payload, setPayload] = useState<CompletionCelebrationPayload | null>(null);

  useEffect(() => {
    const p = consumeCompletionCelebration(topicSlug);
    if (p) {
      setPayload(p);
      onConsumed?.();
    }
  }, [topicSlug, onConsumed]);

  if (!payload) return null;

  return (
    <CompletionCelebrationCard
      payload={payload}
      onDismiss={() => setPayload(null)}
      sessionCompletionCount={getSessionCompletionCount()}
    />
  );
}
