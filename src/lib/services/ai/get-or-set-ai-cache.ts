/**
 * Phase 9 — AI response cache helper.
 * Check ai_cache; if miss, run generator and store.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";

export type GetOrSetCacheResult<T> =
  | { ok: true; value: T; fromCache: boolean }
  | { ok: false; error: string };

/**
 * Get cached response or run generator and store.
 * Uses stable string cache keys. Prevents duplicate inserts via upsert.
 */
export async function getOrSetAICache<T>(
  cacheKey: string,
  generatorFn: () => Promise<T>
): Promise<GetOrSetCacheResult<T>> {
  if (typeof window !== "undefined") {
    return { ok: false, error: "Cache must run server-side only." };
  }

  const key = String(cacheKey).trim();
  if (!key) {
    return { ok: false, error: "Cache key is required." };
  }

  try {
    const supabase = getSupabaseServiceRoleClient();

    const { data: existing, error: fetchErr } = await supabase
      .from("ai_cache")
      .select("response")
      .eq("cache_key", key)
      .maybeSingle();

    if (fetchErr) {
      return { ok: false, error: fetchErr.message };
    }

    if (existing?.response != null) {
      return { ok: true, value: existing.response as T, fromCache: true };
    }

    const value = await generatorFn();
    const response = value as unknown;

    const { error: upsertErr } = await supabase.from("ai_cache").upsert(
      { cache_key: key, response },
      { onConflict: "cache_key" }
    );

    if (upsertErr) {
      return { ok: false, error: upsertErr.message };
    }

    return { ok: true, value, fromCache: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
