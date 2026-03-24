/**
 * Fetches the shared daily multiplier for a given date.
 * Used when processing completion for daily feature topic.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { XP_CONFIG } from "@/lib/progress/xp-config";

/**
 * Get daily multiplier for the given date.
 * Returns 1.5 as fallback if no row or column missing (migration not run).
 */
export async function getDailyMultiplier(
  supabase: SupabaseClient,
  dateISO: string
): Promise<number> {
  const date = dateISO.slice(0, 10);
  const { data, error } = await supabase
    .from("daily_curiosity")
    .select("daily_multiplier")
    .eq("date", date)
    .maybeSingle();

  if (error || !data) return XP_CONFIG.DAILY_MULTIPLIERS[1]; // 1.5 default

  const mult = Number((data as { daily_multiplier?: number }).daily_multiplier);
  if (!Number.isFinite(mult) || mult < 1 || mult > 3) {
    return XP_CONFIG.DAILY_MULTIPLIERS[1];
  }
  return mult;
}
