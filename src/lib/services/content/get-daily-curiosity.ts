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
};

/**
 * @param dateISO - optional override for testing (defaults to today UTC)
 */
export async function getDailyCuriosity(
  supabase: SupabaseClient,
  dateISO?: string
): Promise<DailyCuriosityResult | null> {
  const date =
    dateISO ??
    new Date().toISOString().slice(0, 10);

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

  return {
    experience,
    theme: row.theme != null ? String(row.theme) : null,
    date: String(row.date ?? date),
  };
}
