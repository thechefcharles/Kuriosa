"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  CompleteCuriosityClientPayload,
  ProgressUpdateResult,
} from "@/types/progress";

export type RecordCuriosityCompletionResult =
  | { ok: true; data: NonNullable<Extract<ProgressUpdateResult, { ok: true }>["data"]> }
  | { ok: false; message: string };

export function useRecordCuriosityCompletion() {
  return useMutation({
    mutationKey: ["progress", "complete-curiosity"],
    mutationFn: async (
      input: CompleteCuriosityClientPayload
    ): Promise<RecordCuriosityCompletionResult> => {
      const res = await fetch("/api/progress/complete-curiosity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "same-origin",
      });

      let json: unknown;
      try {
        json = await res.json();
      } catch {
        return { ok: false, message: "Invalid response from server." };
      }

      const parsed = json as ProgressUpdateResult;
      if (!parsed || typeof parsed !== "object" || !("ok" in parsed)) {
        return { ok: false, message: "Unexpected server response." };
      }

      if (!parsed.ok) {
        return {
          ok: false,
          message:
            "message" in parsed && typeof parsed.message === "string"
              ? parsed.message
              : "Request failed.",
        };
      }

      return { ok: true, data: parsed.data };
    },
  });
}
