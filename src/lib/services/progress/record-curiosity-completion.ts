/**
 * Legacy client-side upsert (Phase 5). Production flow uses
 * Client: `useRecordCuriosityCompletion` → hosted `POST .../api/progress/complete-curiosity`
 * (`fetchApi`) → processCuriosityCompletion (XP, streaks, profile).
 * Kept for reference or one-off scripts only.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type CuriosityCompletionInput = {
  topicId: string;
  /** From session: read / listen / both */
  modeUsed: "read" | "listen" | "read_listen";
  /** Latest challenge outcome when user taps Continue after answering */
  challengeCorrect: boolean;
  wasDailyFeature: boolean;
  wasRandomSpin: boolean;
};

function mergeModeUsed(
  previous: string | null | undefined,
  next: CuriosityCompletionInput["modeUsed"]
): string {
  const parts = new Set<string>();
  const add = (m: string) => {
    if (m === "read_listen") {
      parts.add("read");
      parts.add("listen");
    } else if (m === "read" || m === "listen") {
      parts.add(m);
    }
  };
  if (previous) {
    if (previous.includes("listen")) parts.add("listen");
    if (previous.includes("read")) parts.add("read");
  }
  add(next);
  if (parts.has("read") && parts.has("listen")) return "read_listen";
  if (parts.has("listen")) return "listen";
  return "read";
}

export type RecordCompletionResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Upserts by (user_id, topic_id): updates earliest row if duplicates exist, else inserts.
 */
export async function recordCuriosityCompletion(
  supabase: SupabaseClient,
  userId: string,
  input: CuriosityCompletionInput
): Promise<RecordCompletionResult> {
  const topicId = input.topicId.trim();
  if (!topicId || !userId.trim()) {
    return { ok: false, message: "Missing topic or user" };
  }

  const now = new Date().toISOString();
  const quizScore = input.challengeCorrect ? 100 : 0;

  const { data: rows, error: selErr } = await supabase
    .from("user_topic_history")
    .select(
      "id, started_at, mode_used, was_daily_feature, was_random_spin"
    )
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true })
    .limit(1);

  if (selErr) {
    return { ok: false, message: selErr.message };
  }

  const existing = rows?.[0] as
    | {
        id: string;
        started_at: string | null;
        mode_used: string | null;
        was_daily_feature: boolean;
        was_random_spin: boolean;
      }
    | undefined;

  const mode_used = mergeModeUsed(existing?.mode_used ?? null, input.modeUsed);
  const was_daily_feature =
    Boolean(existing?.was_daily_feature) || input.wasDailyFeature;
  const was_random_spin =
    Boolean(existing?.was_random_spin) || input.wasRandomSpin;

  const patch = {
    completed_at: now,
    updated_at: now,
    mode_used,
    quiz_score: quizScore,
    xp_earned: 0,
    was_daily_feature,
    was_random_spin,
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("user_topic_history")
      .update({
        ...patch,
        started_at: existing.started_at ?? now,
      })
      .eq("id", existing.id);

    if (error) return { ok: false, message: error.message };
    return { ok: true };
  }

  const { error } = await supabase.from("user_topic_history").insert({
    user_id: userId,
    topic_id: topicId,
    started_at: now,
    ...patch,
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
