/**
 * Persist generated (or uploaded) narration metadata on `topics`.
 * Server-side; use service-role client for CMS scripts.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type SaveGeneratedAudioPayload = {
  audioUrl: string;
  /** Stored as topics.audio_script (transcript / narration source) */
  audioScript?: string | null;
  audioDurationSeconds?: number | null;
};

export async function saveGeneratedAudioMetadata(
  supabase: SupabaseClient,
  topicId: string,
  payload: SaveGeneratedAudioPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const id = topicId.trim();
  if (!id) return { ok: false, error: "topicId is required" };
  const url = payload.audioUrl.trim();
  if (!url.startsWith("http")) {
    return { ok: false, error: "audioUrl must be an http(s) URL" };
  }

  const row: Record<string, string | number | null> = {
    audio_url: url,
    updated_at: new Date().toISOString(),
  };
  if (payload.audioScript !== undefined) {
    row.audio_script = payload.audioScript?.trim() || null;
  }
  if (payload.audioDurationSeconds !== undefined && payload.audioDurationSeconds != null) {
    const n = Number(payload.audioDurationSeconds);
    row.audio_duration_seconds = Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  }

  const { error } = await supabase.from("topics").update(row).eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
