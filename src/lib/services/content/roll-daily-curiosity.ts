/**
 * Picks a topic and upserts `daily_curiosity` for a calendar date (UTC).
 * Used by Vercel Cron and can be called from scripts.
 *
 * Prefers topics with is_random_featured; avoids repeats from recent daily_curiosity rows.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { XP_CONFIG } from "@/lib/progress/xp-config";

export type RollDailyCuriosityResult =
  | { ok: true; date: string; topicId: string; slug: string; title: string }
  | { ok: false; message: string };

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateDaysAgoUTC(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function pickRandom<T>(items: T[]): T | null {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)]!;
}

/**
 * @param dateISO - YYYY-MM-DD (UTC). Defaults to today UTC.
 */
export async function rollDailyCuriosity(
  supabase: SupabaseClient,
  dateISO?: string
): Promise<RollDailyCuriosityResult> {
  const date = dateISO?.trim() || todayUTC();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, message: "Invalid dateISO (expected YYYY-MM-DD)." };
  }

  const since = dateDaysAgoUTC(30);
  const { data: recentRows, error: recentErr } = await supabase
    .from("daily_curiosity")
    .select("topic_id")
    .gte("date", since);

  if (recentErr) {
    return { ok: false, message: recentErr.message };
  }

  const recentIds = new Set(
    (recentRows ?? [])
      .map((r) => r.topic_id as string)
      .filter(Boolean)
  );

  async function candidatePool(featuredOnly: boolean) {
    let q = supabase
      .from("topics")
      .select("id, slug, title")
      .eq("status", "published");
    if (featuredOnly) {
      q = q.eq("is_random_featured", true);
    }
    const { data, error } = await q;
    if (error) return { rows: [] as { id: string; slug: string; title: string }[], error };
    const rows = (data ?? []) as { id: string; slug: string; title: string }[];
    const avoidingRepeat = rows.filter((r) => !recentIds.has(r.id));
    const pool = avoidingRepeat.length ? avoidingRepeat : rows;
    return { rows: pool, error: null as null };
  }

  let { rows: pool, error: poolErr } = await candidatePool(true);
  if (poolErr) {
    return { ok: false, message: poolErr.message };
  }
  if (!pool.length) {
    const fallback = await candidatePool(false);
    if (fallback.error) {
      return { ok: false, message: fallback.error.message };
    }
    pool = fallback.rows;
  }

  const chosen = pickRandom(pool);
  if (!chosen) {
    return { ok: false, message: "No published topics available." };
  }

  const mults = [...XP_CONFIG.DAILY_MULTIPLIERS];
  const dailyMultiplier = pickRandom(mults) ?? 1.5;

  const { error: upsertErr } = await supabase.from("daily_curiosity").upsert(
    {
      date,
      topic_id: chosen.id,
      theme: "Daily challenge",
      daily_multiplier: dailyMultiplier,
    },
    { onConflict: "date" }
  );

  if (upsertErr) {
    return { ok: false, message: upsertErr.message };
  }

  return {
    ok: true,
    date,
    topicId: chosen.id,
    slug: chosen.slug,
    title: chosen.title,
  };
}
