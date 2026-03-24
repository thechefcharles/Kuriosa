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
  /** True when user has completed this topic (rewards_granted) */
  isCompleted: boolean;
  /** XP earned when completed (from user_topic_history.xp_earned) */
  xpEarned?: number;
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
    .select("topic_id, theme, date")
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
  if (options?.userId?.trim()) {
    const { data: hist } = await supabase
      .from("user_topic_history")
      .select("id, xp_earned")
      .eq("user_id", options.userId)
      .eq("topic_id", topicId)
      .eq("rewards_granted", true)
      .limit(1);
    if (hist?.length) {
      isCompleted = true;
      const xp = (hist[0] as { xp_earned?: number | null }).xp_earned;
      xpEarned =
        xp != null && Number.isFinite(Number(xp)) ? Math.max(0, Math.round(Number(xp))) : undefined;
    }
  }

  return {
    experience,
    theme: row.theme != null ? String(row.theme) : null,
    date: String(row.date ?? date),
    isCompleted,
    ...(xpEarned !== undefined ? { xpEarned } : {}),
  };
}
