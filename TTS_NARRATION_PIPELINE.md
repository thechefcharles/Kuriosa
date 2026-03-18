# Automated narration (OpenAI or ElevenLabs)

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
# First 5 published topics that don’t have audio_url yet
npm run audio:tts-upload -- --limit=5

# One topic by slug
npm run audio:tts-upload -- --slug=why-octopuses-have-three-hearts

# Regenerate even if audio_url already set
npm run audio:tts-upload -- --slug=my-slug --force

# See which would run (no API calls)
npm run audio:tts-upload -- --dry-run --limit=10
```

## Limits & cost

- **OpenAI:** max **~4096 characters** per topic; longer lessons are **trimmed** (see console warning).
- **ElevenLabs:** max **~8000 characters** per request in this script (trimmed if longer).
- Each run = **one TTS API call + one Storage upload** per topic → **paid** usage on both sides.

## Quality tip

For shorter, more “podcast-like” narration, generate **`audio_script`** first (`npm run ai:audio` / your content pipeline), persist it to **`topics.audio_script`**, then run **`audio:tts-upload`** — TTS will use that script instead of the full lesson.
