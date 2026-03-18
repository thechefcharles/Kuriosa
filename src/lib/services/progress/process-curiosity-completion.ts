/**
 * Server-side progress engine: one completion event → history + profile updates.
 * Call only with a Supabase client scoped to the target user (RLS) or service role in trusted scripts.
 *
 * MVP rules — see COMPLETION_PROGRESS_PROCESSOR.md:
 * - First rewarded completion per (user, topic): full XP, streak rules, curiosity score refresh.
 * - Later completions: metadata only (no extra XP, streak unchanged).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CompletionEventInput,
  CuriosityCompletionPayload,
  ProgressUpdateResult,
  ProgressUpdateSuccess,
} from "@/types/progress";
import { calculateRewards } from "@/lib/progress/calculate-rewards";
import { getLevelFromXP } from "@/lib/progress/level-config";
import { calculateCuriosityScore } from "@/lib/progress/curiosity-score";
import { calculateNextStreak } from "@/lib/progress/streak-utils";

function mergeModeUsed(
  previous: string | null | undefined,
  next: CuriosityCompletionPayload["modeUsed"]
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

function toRewardEvent(p: CuriosityCompletionPayload): CompletionEventInput {
  return {
    lessonCompleted: p.lessonCompleted,
    challengeAttempted: p.challengeAttempted,
    challengeCorrect: p.challengeCorrect,
    wasDailyFeature: p.wasDailyFeature,
    wasRandomSpin: p.wasRandomSpin,
    usedListenMode: p.usedListenMode,
  };
}

async function fetchScoreInputs(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  topicsCompleted: number;
  accuracyRatio: number;
  distinctCategoriesExplored: number;
}> {
  const { data: rows, error } = await supabase
    .from("user_topic_history")
    .select("challenge_correct, topic_id")
    .eq("user_id", userId)
    .eq("rewards_granted", true);

  if (error || !rows?.length) {
    return {
      topicsCompleted: rows?.length ?? 0,
      accuracyRatio: 0,
      distinctCategoriesExplored: 0,
    };
  }

  const attempted = rows.filter(
    (r) => r.challenge_correct !== null && r.challenge_correct !== undefined
  ).length;
  const correct = rows.filter((r) => r.challenge_correct === true).length;
  const accuracyRatio = attempted > 0 ? correct / attempted : 0;

  const topicIds = [...new Set(rows.map((r) => r.topic_id))];
  let distinctCategoriesExplored = 0;
  if (topicIds.length) {
    const { data: topics } = await supabase
      .from("topics")
      .select("category_id")
      .in("id", topicIds);
    distinctCategoriesExplored = new Set(
      (topics ?? []).map((t) => t.category_id)
    ).size;
  }

  return {
    topicsCompleted: rows.length,
    accuracyRatio,
    distinctCategoriesExplored,
  };
}

function emptySuccessBase(
  profile: {
    total_xp: number;
    current_streak: number;
    longest_streak: number;
    curiosity_score: number;
  },
  warnings: string[]
): ProgressUpdateSuccess {
  const level = getLevelFromXP(profile.total_xp);
  return {
    xpEarned: 0,
    wasCountedAsNewCompletion: false,
    levelBefore: level,
    levelAfter: level,
    streakBefore: profile.current_streak,
    streakAfter: profile.current_streak,
    curiosityScoreBefore: profile.curiosity_score,
    curiosityScoreAfter: profile.curiosity_score,
    profileUpdated: false,
    historyUpdated: true,
    breakdown: null,
    warnings,
  };
}

export async function processCuriosityCompletion(
  supabase: SupabaseClient,
  payload: CuriosityCompletionPayload
): Promise<ProgressUpdateResult> {
  const userId = payload.userId.trim();
  const topicId = payload.topicId.trim();
  if (!userId || !topicId) {
    return { ok: false, message: "Missing user or topic" };
  }

  const now = new Date(payload.completedAt);
  const completedAtIso = now.toISOString();

  const { data: topic, error: topicErr } = await supabase
    .from("topics")
    .select("id, slug")
    .eq("id", topicId)
    .maybeSingle();

  if (topicErr || !topic) {
    return { ok: false, message: "Topic not found" };
  }
  if (String(topic.slug) !== payload.slug?.trim()) {
    return { ok: false, message: "Topic slug mismatch" };
  }

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select(
      "total_xp, current_level, curiosity_score, current_streak, longest_streak, last_active_date"
    )
    .eq("id", userId)
    .maybeSingle();

  if (profErr || !profile) {
    return { ok: false, message: "Profile not found" };
  }

  const p = profile as {
    total_xp: number;
    current_level: number;
    curiosity_score: number;
    current_streak: number;
    longest_streak: number;
    last_active_date: string | null;
  };

  const levelBefore = getLevelFromXP(p.total_xp);

  const { data: histRows } = await supabase
    .from("user_topic_history")
    .select(
      "id, rewards_granted, started_at, mode_used, was_daily_feature, was_random_spin"
    )
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .limit(1);

  const existing = histRows?.[0] as
    | {
        id: string;
        rewards_granted: boolean;
        started_at: string | null;
        mode_used: string | null;
        was_daily_feature: boolean;
        was_random_spin: boolean;
      }
    | undefined;

  const mode_used = mergeModeUsed(existing?.mode_used ?? null, payload.modeUsed);
  const was_daily =
    Boolean(existing?.was_daily_feature) || payload.wasDailyFeature;
  const was_random =
    Boolean(existing?.was_random_spin) || payload.wasRandomSpin;
  const quizScore = payload.challengeCorrect ? 100 : 0;

  const historyPatch = {
    completed_at: completedAtIso,
    updated_at: completedAtIso,
    mode_used,
    quiz_score: quizScore,
    challenge_correct: payload.challengeCorrect,
    was_daily_feature: was_daily,
    was_random_spin: was_random,
  };

  if (existing?.rewards_granted) {
    const { error: upErr } = await supabase
      .from("user_topic_history")
      .update(historyPatch)
      .eq("id", existing.id);

    if (upErr) return { ok: false, message: upErr.message };

    return {
      ok: true,
      data: emptySuccessBase(p, [
        "Topic already completed for XP; updated visit details only.",
      ]),
    };
  }

  if (!existing) {
    const { error: insErr } = await supabase.from("user_topic_history").insert({
      user_id: userId,
      topic_id: topicId,
      rewards_granted: false,
      started_at: completedAtIso,
      completed_at: null,
      mode_used,
      was_daily_feature: was_daily,
      was_random_spin: was_random,
      quiz_score: 0,
      challenge_correct: null,
      xp_earned: 0,
    });

    if (insErr && insErr.code !== "23505") {
      return { ok: false, message: insErr.message };
    }
  }

  const rewards = calculateRewards(toRewardEvent(payload));

  const { data: claimed, error: claimErr } = await supabase
    .from("user_topic_history")
    .update({
      ...historyPatch,
      rewards_granted: true,
      xp_earned: rewards.xpEarned,
      started_at: existing?.started_at ?? completedAtIso,
    })
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .eq("rewards_granted", false)
    .select("id")
    .maybeSingle();

  if (claimErr) return { ok: false, message: claimErr.message };

  if (!claimed) {
    const { data: again } = await supabase
      .from("user_topic_history")
      .select("rewards_granted")
      .eq("user_id", userId)
      .eq("topic_id", topicId)
      .maybeSingle();

    if (again?.rewards_granted) {
      await supabase
        .from("user_topic_history")
        .update(historyPatch)
        .eq("user_id", userId)
        .eq("topic_id", topicId);

      return {
        ok: true,
        data: emptySuccessBase(p, [
          "Another request already granted XP for this topic.",
        ]),
      };
    }
    return { ok: false, message: "Could not claim completion reward" };
  }

  const newXp = p.total_xp + rewards.xpEarned;
  const levelAfter = getLevelFromXP(newXp);
  const streakResult = calculateNextStreak(
    p.current_streak,
    p.last_active_date,
    now
  );
  const streak = streakResult.nextStreak;
  const longest = streakResult.countedToday
    ? Math.max(p.longest_streak, streak)
    : p.longest_streak;
  const today = now.toISOString().slice(0, 10);

  const scoreInputs = await fetchScoreInputs(supabase, userId);
  const curiosityScoreAfter = calculateCuriosityScore({
    topicsCompleted: scoreInputs.topicsCompleted,
    accuracyRatio: scoreInputs.accuracyRatio,
    distinctCategoriesExplored: scoreInputs.distinctCategoriesExplored,
    streakLength: streak,
  });

  const { error: profUp } = await supabase
    .from("profiles")
    .update({
      total_xp: newXp,
      current_level: levelAfter,
      curiosity_score: curiosityScoreAfter,
      current_streak: streak,
      longest_streak: longest,
      last_active_date: today,
      updated_at: completedAtIso,
    })
    .eq("id", userId);

  if (profUp) {
    await supabase
      .from("user_topic_history")
      .update({
        rewards_granted: false,
        xp_earned: 0,
        updated_at: completedAtIso,
      })
      .eq("user_id", userId)
      .eq("topic_id", topicId);
    return {
      ok: false,
      message: `Profile update failed; reward claim reverted. Retry. ${profUp.message}`,
    };
  }

  const data: ProgressUpdateSuccess = {
    xpEarned: rewards.xpEarned,
    wasCountedAsNewCompletion: true,
    levelBefore,
    levelAfter,
    streakBefore: p.current_streak,
    streakAfter: streak,
    curiosityScoreBefore: p.curiosity_score,
    curiosityScoreAfter,
    profileUpdated: true,
    historyUpdated: true,
    breakdown: rewards.breakdown,
    warnings: [],
  };

  return { ok: true, data };
}
