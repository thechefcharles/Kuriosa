# Phase 8.3 summary — AI generation foundation & Listen completion

## Implemented

1. **`generateAudioFromScript`** — Server TTS (OpenAI default, ElevenLabs optional) → Storage upload → returns URL, path, duration estimate, transcript used. **No DB** inside this function.
2. **`audio-provider-config`** — Small typed config + `resolveGenerationProvider`.
3. **`saveGeneratedAudioMetadata`** — Centralized `topics` update for `audio_url`, `audio_script`, `audio_duration_seconds`.
4. **`npm run audio:generate-example -- --slug=...`** — End-to-end generate + save for one published topic.
5. **`AudioPlayer`** — `onPlaybackEnded` / `onPlaybackBegan` (ref-stable), `playsInline`, mobile-friendly controls and copy.
6. **`AudioCompleteCallout`** — After narration ends in Listen: **Continue to challenge** (if quiz exists) or fallback copy. **No auto-navigation, no XP on end.**
7. **`AUDIO_GENERATION_AND_COMPLETION_ARCHITECTURE.md`**

## How AI-generated audio fits

- **Intended default:** generate during/after content creation (script → TTS → Storage → row), not long-term manual uploads per topic.
- **Fallback:** paste any `https` `audio_url` (unchanged).

## How audio completion works

Listen → play → **ended** → callout → user taps → `/challenge/[slug]` → normal challenge/progress flow.

## What 8.4 will do next

- Optional admin UI for generation triggers, polish on duration metadata, Media Session if roadmap says so.
