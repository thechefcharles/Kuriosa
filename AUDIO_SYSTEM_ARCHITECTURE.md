# Audio system architecture (Phase 8.1)

Beginner-friendly overview of how **Listen Mode** gets reliable data.

## Source of truth

| Layer | Field | Role |
|-------|--------|------|
| **Database (`topics`)** | `audio_url` | **Canonical playback URL** — must be `http` or `https` for Listen Mode. |
| | `audio_script` | Optional spoken script; used as transcript when set. |
| | `audio_duration_seconds` | Optional hint; player still reads duration from the file when possible. |

If `audio_url` is missing, empty, or not HTTP(S), the app treats the topic as **read-only** for audio (no crash).

## Loading (`loadCuriosityExperience`)

1. Reads `audio_url`, `audio_script`, `audio_duration_seconds`, and `lesson_text`.
2. **`getNormalizedAudioData()`** (pure helper):
   - Validates URL with **`isValidAudioUrl()`** (only `http:` / `https:`).
   - **Transcript:** `audio_script` if present, otherwise **lesson text** when audio is valid.
   - **Duration:** from DB if positive; otherwise `null` (UI can use HTML audio metadata).
3. **`LoadedCuriosityExperience.audio`** is always:
   - **`null`** — no valid audio URL, or
   - **`CuriosityAudioBlock`** — `{ audioUrl, durationSeconds, transcript }` with non-empty valid `audioUrl`.

So the UI never has to guess between `undefined` and “empty object”: use **`isAudioAvailable(audio)`** for Listen Mode.

## Storage (uploads)

- **Bucket:** `curiosity-audio` by default, or **`NEXT_PUBLIC_SUPABASE_AUDIO_BUCKET`**.
- **Path pattern:** `audio/{topicId}.{ext}` (e.g. `.mp3`).
- **`uploadCuriosityAudio()`** — upload blob; returns **public URL** (bucket should be public or you’ll need signed URLs later).
- **`getAudioPublicUrl()`** — build public URL from a storage path.

Configure Storage policies in Supabase so only trusted roles can write; the app does not embed secrets.

**Step-by-step (bucket, policies, saving `audio_url`):** see **`AUDIO_STORAGE_SETUP.md`**.  
**Automated TTS (OpenAI / ElevenLabs → Storage → `audio_url`):** **`TTS_NARRATION_PIPELINE.md`**.

## Listen Mode availability

- **`isAudioAvailable(experience.audio)`** is `true` only when the loader produced a block with a valid HTTP(S) URL.
- **Read Mode** is unchanged when audio is `null` or invalid.

## Player

- **`AudioPlayer`** uses a single **`<audio src={...}>`** element. The **URL always comes from `CuriosityAudioBlock.audioUrl`**.
- Invalid URLs never reach the player (loader filters them); if the file 404s, the player shows an error state without crashing the page.

## Future: background playback

Not implemented in 8.1. The player is documented so a later phase can:

- Attach **Media Session** metadata to the same logical source.
- Optionally move to a **shared audio context** that survives route changes, still using **`audio_url`** as the single canonical string.

## Files to know

| File | Purpose |
|------|---------|
| `src/lib/audio/is-valid-audio-url.ts` | URL guard |
| `src/lib/audio/is-audio-available.ts` | Listen Mode gate |
| `src/lib/services/audio/audio-metadata.ts` | `getNormalizedAudioData` |
| `src/lib/services/audio/upload-audio.ts` | Storage upload |
| `src/lib/services/audio/get-audio-public-url.ts` | Public URL helper |
| `src/lib/services/content/load-curiosity-experience.ts` | Wires DB → `audio` block |
