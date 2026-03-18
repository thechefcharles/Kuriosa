import type { SupabaseClient } from "@supabase/supabase-js";
import { getCuriosityAudioBucketName } from "@/lib/services/audio/storage-config";

/**
 * Public URL for an object in the curiosity-audio bucket.
 * @param storagePath - Path inside the bucket, e.g. `audio/{topicId}.mp3` (no leading slash)
 */
export function getAudioPublicUrl(
  supabase: SupabaseClient,
  storagePath: string
): string {
  const path = storagePath.replace(/^\/+/, "");
  const bucket = getCuriosityAudioBucketName();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
