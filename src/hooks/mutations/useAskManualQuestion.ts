"use client";

import { useMutation } from "@tanstack/react-query";
import type { ManualQuestionResult } from "@/types/ai";

export type AskManualQuestionInput = {
  slug: string;
  topicId?: string;
  questionText: string;
};

async function askManualQuestion(
  input: AskManualQuestionInput
): Promise<ManualQuestionResult> {
  const res = await fetch("/api/ai/manual-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionText: input.questionText,
      slug: input.slug,
      topicId: input.topicId,
    }),
    credentials: "same-origin",
  });

  const json = (await res.json()) as ManualQuestionResult;

  if (!res.ok) {
    const err =
      "error" in json && typeof json.error === "string"
        ? json.error
        : "Request failed";
    return {
      ok: false,
      fromCache: false,
      moderated: false,
      rateLimited: res.status === 429,
      fallbackUsed: true,
      error: err,
    };
  }

  return json;
}

export function useAskManualQuestion() {
  return useMutation({
    mutationKey: ["ai", "manual-question"],
    mutationFn: askManualQuestion,
  });
}
