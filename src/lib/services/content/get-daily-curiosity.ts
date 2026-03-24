/**
 * Resolves today's featured row from daily_curiosity → full experience.
 *
 * Fallback: returns null when no row exists for the given date (app shows empty state).
 * Date is UTC calendar date (YYYY-MM-DD) to match typical seeding and Supabase date columns.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { loadCuriosityExperience } from "@/lib/services/content/load-curiosity-experience";

export type DailyCuriosityResult = {
  /** Assembled topic experience (same shape as slug load). */
  experience: LoadedCuriosityExperience;
  /** Optional editorial theme from daily_curiosity.theme */
  theme: string | null;
  /** ISO date string YYYY-MM-DD */
  date: string;
  /** Daily multiplier for today (1.2–2.5). Default 1.5 if not set. */
  dailyMultiplier?: number;
  /** True when user has completed this topic (rewards_granted) */
  isCompleted: boolean;
  /** XP earned when completed (from user_topic_history.xp_earned) */
  xpEarned?: number;
  /** True when challenge was answered correctly (from user_topic_history.challenge_correct) */
  challengeCorrect?: boolean;
};

export type GetDailyCuriosityOptions = {
  dateISO?: string;
  /** When set, checks user_topic_history for isCompleted */
  userId?: string | null;
};

/**
 * @param dateISO - optional override for testing (defaults to today UTC)
 */
export async function getDailyCuriosity(
  supabase: SupabaseClient,
  dateISO?: string,
  options?: GetDailyCuriosityOptions
): Promise<DailyCuriosityResult | null> {
  const date =
    options?.dateISO ?? dateISO ?? new Date().toISOString().slice(0, 10);

  const { data: row, error } = await supabase
    .from("daily_curiosity")
    .select("topic_id, theme, date, daily_multiplier")
    .eq("date", date)
    .maybeSingle();

  if (error || !row?.topic_id) {
    return null;
  }

  const topicId = String(row.topic_id);
  const experience = await loadCuriosityExperience(supabase, { topicId });

  if (!experience) {
    return null;
  }

  let isCompleted = false;
  let xpEarned: number | undefined;
  let challengeCorrect: boolean | undefined;
  if (options?.userId?.trim()) {
    const { data: hist } = await supabase
      .from("user_topic_history")
      .select("id, xp_earned, challenge_correct")
      .eq("user_id", options.userId)
      .eq("topic_id", topicId)
      .eq("rewards_granted", true)
      .limit(1);
    if (hist?.length) {
      isCompleted = true;
      const h = hist[0] as { xp_earned?: number | null; challenge_correct?: boolean | null };
      const xp = h.xp_earned;
      xpEarned =
        xp != null && Number.isFinite(Number(xp)) ? Math.max(0, Math.round(Number(xp))) : undefined;
      challengeCorrect =
        h.challenge_correct === true || h.challenge_correct === false ? h.challenge_correct : undefined;
    }
  }

  const rawMult = (row as { daily_multiplier?: number | null }).daily_multiplier;
  const dailyMultiplier =
    rawMult != null && Number.isFinite(Number(rawMult))
      ? Math.min(3, Math.max(1, Number(rawMult)))
      : 1.5;

  return {
    experience,
    theme: row.theme != null ? String(row.theme) : null,
    date: String(row.date ?? date),
    dailyMultiplier,
    isCompleted,
    ...(xpEarned !== undefined ? { xpEarned } : {}),
    ...(challengeCorrect !== undefined ? { challengeCorrect } : {}),
  };
}
