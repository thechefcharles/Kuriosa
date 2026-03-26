"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CompleteCuriosityClientPayload,
  ProgressUpdateResult,
} from "@/types/progress";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { invalidateProgressQueries } from "@/lib/query/invalidate-progress-queries";
import { fetchApi } from "@/lib/network/fetch-api";

export type RecordCuriosityCompletionResult =
  | { ok: true; data: NonNullable<Extract<ProgressUpdateResult, { ok: true }>["data"]> }
  | { ok: false; message: string };

export function useRecordCuriosityCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["progress", "complete-curiosity"],
    mutationFn: async (
      input: CompleteCuriosityClientPayload
    ): Promise<RecordCuriosityCompletionResult> => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const res = await fetchApi("/api/progress/complete-curiosity", {
        method: "POST",
        headers,
        body: JSON.stringify(input),
      });

      let json: unknown;
      try {
        json = await res.json();
      } catch {
        if (!res.ok) {
          return {
            ok: false,
            message:
              res.status === 404
                ? "Could not reach the progress API. In the iOS/Android app, set NEXT_PUBLIC_API_ORIGIN to your deployed site URL in .env.local, then rebuild with npm run build:export."
                : `Server returned ${res.status} (not JSON). Check NEXT_PUBLIC_API_ORIGIN and CORS on your host.`,
          };
        }
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
    onSuccess: async (result) => {
      if (!result.ok) return;
      const sb = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await sb.auth.getUser();
      invalidateProgressQueries(queryClient, user?.id ?? null);
    },
  });
}
