/**
 * Generate narration with OpenAI or ElevenLabs TTS, upload to curiosity-audio, set topics.audio_url.
 *
 * Run:
 *   npm run audio:tts-upload -- --limit=3
 *   npm run audio:tts-upload -- --slug=my-topic-slug
 *   npm run audio:tts-upload -- --limit=5 --force
 *
 * Requires .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY (default provider)
 *   OR TTS_PROVIDER=elevenlabs + ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID
 *
 * Optional: NEXT_PUBLIC_SUPABASE_AUDIO_BUCKET if not curiosity-audio
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { uploadCuriosityAudio } from "@/lib/services/audio/upload-audio";
import {
  estimateDurationSecondsFromMp3Bytes,
  getTtsProvider,
  synthesizeNarrationToMp3,
} from "@/lib/services/audio/tts/synthesize-narration";
import { buildNarrationTextForTopic } from "@/lib/services/audio/tts/narration-text-for-topic";

function parseArgs(): {
  limit: number;
  slug: string | null;
  force: boolean;
  dryRun: boolean;
} {
  let limit = 5;
  let slug: string | null = null;
  let force = false;
  let dryRun = false;
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--limit=")) limit = Math.max(1, parseInt(a.slice(8), 10) || 5);
    else if (a.startsWith("--slug=")) slug = a.slice(7).trim() || null;
    else if (a === "--force") force = true;
    else if (a === "--dry-run") dryRun = true;
  }
  return { limit, slug, force, dryRun };
}

async function main(): Promise<void> {
  const { limit, slug, force, dryRun } = parseArgs();
  console.log("TTS → Storage → topics.audio_url");
  console.log("Provider:", getTtsProvider(), dryRun ? "(dry-run)" : "");

  const supabase = getSupabaseServiceRoleClient();

  const { data: rows, error } = await supabase
    .from("topics")
    .select("id, slug, title, lesson_text, audio_script, audio_url, status")
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(slug ? 50 : Math.max(limit * 10, 50));

  if (error) {
    console.error("Query error:", error.message);
    process.exit(1);
  }

  const list = (rows ?? []) as Array<{
    id: string;
    slug: string;
    title: string | null;
    lesson_text: string | null;
    audio_script: string | null;
    audio_url: string | null;
  }>;

  let candidates = list.filter((r) => {
    if (slug && r.slug !== slug) return false;
    if (force) return true;
    return !r.audio_url?.trim();
  });

  candidates = candidates.slice(0, limit);

  if (candidates.length === 0) {
    console.log(
      "No topics to process. Try --slug=my-slug, increase pool, or --force to regenerate audio."
    );
    return;
  }

  for (const row of candidates) {
    const text = buildNarrationTextForTopic(row);
    if (!text) {
      console.warn(`Skip ${row.slug}: no audio_script or lesson_text`);
      continue;
    }

    console.log(`\n→ ${row.slug} (${text.length} chars)`);

    if (dryRun) continue;

    try {
      const mp3 = await synthesizeNarrationToMp3(text);
      const blob = new Blob([new Uint8Array(mp3)], { type: "audio/mpeg" });
      const up = await uploadCuriosityAudio(supabase, {
        file: blob,
        topicId: row.id,
        extension: "mp3",
      });

      if (!up.ok) {
        console.error("  Upload failed:", up.error);
        continue;
      }

      const duration = estimateDurationSecondsFromMp3Bytes(mp3.length);

      const { error: uerr } = await supabase
        .from("topics")
        .update({
          audio_url: up.publicUrl,
          audio_duration_seconds: duration,
        })
        .eq("id", row.id);

      if (uerr) {
        console.error("  DB update failed:", uerr.message);
        continue;
      }

      console.log("  ✓", up.publicUrl);
    } catch (e) {
      console.error("  Error:", e instanceof Error ? e.message : e);
    }
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
