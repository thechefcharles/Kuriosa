"use client";

import { useMutation } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import {
  recordCuriosityCompletion,
  type CuriosityCompletionInput,
} from "@/lib/services/progress/record-curiosity-completion";

export function useRecordCuriosityCompletion() {
  return useMutation({
    mutationKey: ["progress", "record-curiosity-completion"],
    mutationFn: async (input: CuriosityCompletionInput) => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        return { ok: false as const, message: "Sign in to save progress." };
      }
      return recordCuriosityCompletion(supabase, user.id, input);
    },
  });
}
