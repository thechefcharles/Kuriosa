# Phase 8 → Phase 9 Handoff

## What Phase 8 completed

- **Listen Mode** gated on a valid **http/https** `audio_url`; **Read** is always available.
- **Server-side TTS** (OpenAI / ElevenLabs) → Storage → **`saveGeneratedAudioMetadata`** path is the intended way to populate audio.
- **Inline HTML5 player** with loading/buffering states, graceful failures, retry, transcript + lesson fallbacks, and **post-listen challenge CTA** without changing XP/challenge rules.
- **Documentation** for env vars, scripts, and architecture (`AUDIO_*`, `LISTEN_MODE_*`, `TTS_NARRATION_PIPELINE.md`, this inventory).

## What Phase 9 can rely on

- **`getNormalizedAudioData`** and **`isValidAudioUrl`** define listen readiness — don’t bypass without updating both server and UI.
- **Curiosity experience** type includes optional `audio`; components assume `audio === null` means no Listen.
- **Challenge flow** remains the authority for completion rewards; audio completion only surfaces UI to the same challenge route.
- **TTS keys and synthesis stay server-only** — client never calls ElevenLabs/OpenAI for narration.

## Assumptions to preserve

1. Do not **require** audio for any core loop.
2. Do not **break** `generateAudioFromScript` / `synthesizeNarration` provider switching when adding features.
3. Keep **playback** concerns in UI/player; **generation/storage** in services.

## Do not casually break

- OpenAI + ElevenLabs env contract (`TTS_PROVIDER`, `AUDIO_GENERATION_PROVIDER`, voice/model vars).
- `saveGeneratedAudioMetadata` shape and bucket conventions.
- Read/Listen toggle semantics and `AudioPanel` mount behavior (single player per page session).

## Still out of scope (unless Phase 9 explicitly scopes it)

- Background audio across navigations  
- Lock screen controls  
- Global persistent mini-player  
- Large refactor of TTS provider abstraction  

## Suggested Phase 9 direction

Product/features beyond audio baseline (e.g. trails, social, recommendations) — audio remains a **stable subsystem** per **`PHASE_8_AUDIO_SYSTEM_INVENTORY.md`**.
