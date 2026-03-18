/**
 * Supabase Storage bucket for curiosity narration files.
 * Override with NEXT_PUBLIC_SUPABASE_AUDIO_BUCKET when the bucket name differs.
 */
export function getCuriosityAudioBucketName(): string {
  return (
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_SUPABASE_AUDIO_BUCKET?.trim()) ||
    "curiosity-audio"
  );
}
