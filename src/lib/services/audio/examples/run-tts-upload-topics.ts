/**
 * Generate narration with OpenAI or ElevenLabs TTS, upload to curiosity-audio, set topics.audio_url.
 *
 * Run:
 *   npm run audio:tts-upload -- --limit=3
 *   npm run audio:tts-upload -- --slug=my-topic-slug
 *   npm run audio:tts-upload -- --limit=5 --force
 *   npm run audio:tts-backfill-all          # every published topic missing audio (loops until done)
 *
 * Requires .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY (default provider)
 *   OR TTS_PROVIDER=elevenlabs + ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID
 *
 * Optional: TTS_BACKFILL_BATCH=15 TTS_BACKFILL_DELAY_MS=400 (rate limiting)
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

type TopicRow = {
  id: string;
  slug: string;
  title: string | null;
  lesson_text: string | null;
  audio_script: string | null;
  audio_url: string | null;
};

function parseArgs(): {
  limit: number;
  slug: string | null;
  force: boolean;
  dryRun: boolean;
  all: boolean;
} {
  let limit = 5;
  let slug: string | null = null;
  let force = false;
  let dryRun = false;
  let all = false;
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--limit=")) limit = Math.max(1, parseInt(a.slice(8), 10) || 5);
    else if (a.startsWith("--slug=")) slug = a.slice(7).trim() || null;
    else if (a === "--force") force = true;
    else if (a === "--dry-run") dryRun = true;
    else if (a === "--all") all = true;
  }
  return { limit, slug, force, dryRun, all };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function processTopic(
  supabase: ReturnType<typeof getSupabaseServiceRoleClient>,
  row: TopicRow,
  dryRun: boolean
): Promise<boolean> {
  const text = buildNarrationTextForTopic(row);
  if (!text) {
    console.warn(`Skip ${row.slug}: no audio_script or lesson_text`);
    return false;
  }

  console.log(`\n→ ${row.slug} (${text.length} chars)`);
  if (dryRun) return true;

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
      return false;
    }

    const duration = estimateDurationSecondsFromMp3Bytes(mp3.length);
    const scriptForDb = text.length <= 60000 ? text : text.slice(0, 60000);

    const updatePayload: Record<string, string | number | null> = {
      audio_url: up.publicUrl,
      audio_duration_seconds: duration,
      updated_at: new Date().toISOString(),
    };
    if (!row.audio_script?.trim()) {
      updatePayload.audio_script = scriptForDb;
    }

    const { error: uerr } = await supabase
      .from("topics")
      .update(updatePayload)
      .eq("id", row.id);

    if (uerr) {
      console.error("  DB update failed:", uerr.message);
      return false;
    }

    console.log("  ✓", up.publicUrl);
    return true;
  } catch (e) {
    console.error("  Error:", e instanceof Error ? e.message : e);
    return false;
  }
}

/** Topics missing usable audio_url (null or empty). */
async function fetchNextMissingBatch(
  supabase: ReturnType<typeof getSupabaseServiceRoleClient>,
  batchSize: number
): Promise<TopicRow[]> {
  const sel =
    "id, slug, title, lesson_text, audio_script, audio_url, status";

  const { data: nullUrl } = await supabase
    .from("topics")
    .select(sel)
    .eq("status", "published")
    .is("audio_url", null)
    .limit(batchSize);

  const { data: emptyUrl } = await supabase
    .from("topics")
    .select(sel)
    .eq("status", "published")
    .eq("audio_url", "")
    .limit(batchSize);

  const seen = new Set<string>();
  const out: TopicRow[] = [];
  for (const r of [...(nullUrl ?? []), ...(emptyUrl ?? [])]) {
    const row = r as TopicRow;
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
    if (out.length >= batchSize) break;
  }
  return out;
}

async function main(): Promise<void> {
  const { limit, slug, force, dryRun, all } = parseArgs();

  if (all && slug) {
    console.error("Use either --all or --slug=, not both.");
    process.exit(1);
  }

  console.log("TTS → Storage → topics.audio_url");
  console.log("Provider:", getTtsProvider(), dryRun ? "(dry-run)" : all ? "(backfill all)" : "");

  const supabase = getSupabaseServiceRoleClient();

  if (all) {
    const batchSize = Math.max(
      1,
      parseInt(process.env.TTS_BACKFILL_BATCH ?? "12", 10) || 12
    );
    const delayMs = Math.max(
      0,
      parseInt(process.env.TTS_BACKFILL_DELAY_MS ?? "350", 10) || 350
    );
    let total = 0;
    let failures = 0;

    for (;;) {
      const batch = await fetchNextMissingBatch(supabase, batchSize);
      if (!batch.length) {
        console.log(
          `\nBackfill finished. Processed ${total} topic(s).${failures ? ` (${failures} failed — fix and re-run)` : ""}`
        );
        break;
      }

      console.log(`\n--- Batch: ${batch.length} topic(s) missing audio ---`);

      for (const row of batch) {
        const ok = await processTopic(supabase, row, dryRun);
        if (dryRun) total++;
        else if (ok) total++;
        else failures++;
        if (delayMs > 0 && !dryRun) await sleep(delayMs);
      }
    }
    return;
  }

  const { data: rows, error } = await supabase
    .from("topics")
    .select(
      "id, slug, title, lesson_text, audio_script, audio_url, status"
    )
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(slug ? 50 : Math.max(limit * 10, 50));

  if (error) {
    console.error("Query error:", error.message);
    process.exit(1);
  }

  const list = (rows ?? []) as TopicRow[];

  let candidates = list.filter((r) => {
    if (slug && r.slug !== slug) return false;
    if (force) return true;
    return !r.audio_url?.trim();
  });

  candidates = candidates.slice(0, limit);

  if (candidates.length === 0) {
    console.log(
      "No topics to process. Try --slug=, --all, --force, or npm run audio:tts-backfill-all."
    );
    return;
  }

  for (const row of candidates) {
    await processTopic(supabase, row, dryRun);
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
