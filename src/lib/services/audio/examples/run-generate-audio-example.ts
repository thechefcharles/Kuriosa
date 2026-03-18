/**
 * Generate TTS via OpenAI (default), upload to Storage, save topics row.
 *
 * Run:
 *   npm run audio:generate-example -- --slug=your-topic-slug
 *
 * Requires .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
 *   curiosity-audio bucket (public read)
 *
 * Uses topics.audio_script if set, else title + lesson_text.
 * Optional: AUDIO_GENERATION_PROVIDER=elevenlabs + ElevenLabs keys.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { generateAudioFromScript } from "@/lib/services/audio/generate-audio-from-script";
import { saveGeneratedAudioMetadata } from "@/lib/services/audio/save-generated-audio-metadata";
import { buildNarrationTextForTopic } from "@/lib/services/audio/tts/narration-text-for-topic";

function parseSlug(): string | null {
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--slug=")) return a.slice(7).trim() || null;
  }
  return null;
}

async function main(): Promise<void> {
  const slug = parseSlug();
  if (!slug) {
    console.error("Usage: npm run audio:generate-example -- --slug=<published-topic-slug>");
    process.exit(1);
  }

  console.log("generate-audio-from-script + saveGeneratedAudioMetadata\n");

  const supabase = getSupabaseServiceRoleClient();
  const { data: row, error } = await supabase
    .from("topics")
    .select("id, slug, title, lesson_text, audio_script")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !row) {
    console.error(error?.message ?? "Topic not found or not published.");
    process.exit(1);
  }

  const topic = row as {
    id: string;
    slug: string;
    title: string | null;
    lesson_text: string | null;
    audio_script: string | null;
  };

  const text = buildNarrationTextForTopic({
    title: topic.title,
    audio_script: topic.audio_script,
    lesson_text: topic.lesson_text,
  });

  if (!text) {
    console.error("No script: add lesson_text or audio_script to this topic.");
    process.exit(1);
  }

  console.log("Topic:", topic.slug, "| chars:", text.length);

  const gen = await generateAudioFromScript(supabase, {
    topicId: topic.id,
    scriptText: text,
  });

  if (!gen.ok) {
    console.error("Generation failed:", gen.error);
    process.exit(1);
  }

  console.log("Uploaded:", gen.storagePath);
  console.log("Public URL:", gen.audioUrl);

  const save = await saveGeneratedAudioMetadata(supabase, topic.id, {
    audioUrl: gen.audioUrl,
    audioScript: gen.transcriptUsed,
    audioDurationSeconds: gen.durationSeconds,
  });

  if (!save.ok) {
    console.error("DB save failed:", save.error);
    process.exit(1);
  }

  console.log("\n✓ topics row updated (audio_url, audio_script, audio_duration_seconds)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
