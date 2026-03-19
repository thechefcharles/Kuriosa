# Automated narration (OpenAI or ElevenLabs)

## Preferred path (Phase 8.3+)

**`npm run audio:generate-example -- --slug=<slug>`** uses the centralized **`generateAudioFromScript`** service (OpenAI-first, optional ElevenLabs) and **`saveGeneratedAudioMetadata`**. See **`AUDIO_GENERATION_AND_COMPLETION_ARCHITECTURE.md`**.

---

## Batch path (legacy-friendly)

You **don’t** need to record or manually upload MP3s for every topic. This pipeline:

1. Takes text from each topic (**`audio_script`** if set, otherwise **title + lesson**).
2. Calls **OpenAI TTS** (default) or **ElevenLabs**.
3. Uploads the MP3 to your **`curiosity-audio`** bucket.
4. Sets **`topics.audio_url`** (and a rough **`audio_duration_seconds`**).

## One-time setup

1. **Bucket** `curiosity-audio` (public) — see `AUDIO_STORAGE_SETUP.md`.
2. **`.env.local`:**
   - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - **`OPENAI_API_KEY`** — for default provider (same key as other AI features).

**For ElevenLabs instead:**

```env
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=your_key
ELEVENLABS_VOICE_ID=voice_id_from_elevenlabs_dashboard
# optional:
# ELEVENLABS_MODEL=eleven_multilingual_v2
```

**OpenAI voices (optional):**

```env
OPENAI_TTS_VOICE=alloy
OPENAI_TTS_MODEL=tts-1
# or tts-1-hd for higher quality / cost
```

## Run

```bash
# ALL published topics missing audio — loops until none left (cost = #topics × TTS price)
npm run audio:tts-backfill-all

# Tune batching / rate limits (optional .env)
# TTS_BACKFILL_BATCH=8 TTS_BACKFILL_DELAY_MS=500 npm run audio:tts-backfill-all

# First 5 published topics that don’t have audio_url yet
npm run audio:tts-upload -- --limit=5

# One topic by slug
npm run audio:tts-upload -- --slug=why-octopuses-have-three-hearts

# Regenerate even if audio_url already set
npm run audio:tts-upload -- --slug=my-slug --force

# See which would run (no API calls)
npm run audio:tts-upload -- --dry-run --limit=10
```

## Existing catalog + new topics going forward

| Situation | What to run |
|-----------|--------------|
| **Backfill everything** | `npm run audio:tts-backfill-all` once (may take a while; costs scale with topic count). |
| **One new topic after publish** | `npm run audio:generate-example -- --slug=new-slug` or `audio:tts-upload -- --slug=new-slug`. |
| **Regular catch-up** | Schedule **`audio:tts-backfill-all`** nightly or after bulk imports — it only processes rows with **no `audio_url`**. |

There is **no in-app “auto-TTS on publish”** yet: add narration **after** topics exist (CLI or a future admin job). Same env + bucket as above.

## Limits & cost

- **OpenAI:** max **~4096 characters** per topic; longer lessons are **trimmed** (see console warning).
- **ElevenLabs:** max **~8000 characters** per request in this script (trimmed if longer).
- Each run = **one TTS API call + one Storage upload** per topic → **paid** usage on both sides.

## Quality tip

For shorter, more “podcast-like” narration, generate **`audio_script`** first (`npm run ai:audio` / your content pipeline), persist it to **`topics.audio_script`**, then run **`audio:tts-upload`** — TTS will use that script instead of the full lesson.
