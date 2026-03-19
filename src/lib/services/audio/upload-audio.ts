import type { SupabaseClient } from "@supabase/supabase-js";
import { getCuriosityAudioBucketName } from "@/lib/services/audio/storage-config";
import { getAudioPublicUrl } from "@/lib/services/audio/get-audio-public-url";

export type UploadCuriosityAudioInput = {
  file: Blob;
  /** Prefer DB id; otherwise stable slug for the object key */
  topicId?: string;
  slug?: string;
  /**
   * File extension without dot, e.g. mp3, m4a.
   * Defaults from blob type or mp3.
   */
  extension?: string;
};

function guessExtension(file: Blob, explicit?: string): string {
  if (explicit?.match(/^[a-z0-9]+$/i)) return explicit.toLowerCase();
  const t = file.type?.toLowerCase() ?? "";
  if (t.includes("mpeg") || t.includes("mp3")) return "mp3";
  if (t.includes("mp4") || t.includes("aac") || t.includes("m4a")) return "m4a";
  if (t.includes("wav")) return "wav";
  if (t.includes("ogg")) return "ogg";
  return "mp3";
}

/**
 * Upload narration to Storage at `audio/{topicId}.{ext}`.
 * Caller must use a client authorized to write (e.g. service role server-side, or authenticated user with bucket policy).
 */
export async function uploadCuriosityAudio(
  supabase: SupabaseClient,
  input: UploadCuriosityAudioInput
): Promise<
  { ok: true; publicUrl: string; storagePath: string } | { ok: false; error: string }
> {
  const id = (input.topicId ?? input.slug ?? "").trim();
  if (!id) return { ok: false, error: "topicId or slug is required" };
  if (!input.file || input.file.size <= 0) {
    return { ok: false, error: "file is empty" };
  }

  const ext = guessExtension(input.file, input.extension);
  const storagePath = `audio/${encodeURIComponent(id)}.${ext}`;
  const bucket = getCuriosityAudioBucketName();
  const contentType =
    input.file.type && input.file.type.length > 0
      ? input.file.type
      : `audio/${ext === "mp3" ? "mpeg" : ext}`;

  const { error } = await supabase.storage.from(bucket).upload(storagePath, input.file, {
    upsert: true,
    contentType,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    publicUrl: getAudioPublicUrl(supabase, storagePath),
    storagePath,
  };
}
