# Phase 8.1 summary — audio data pipeline

## Implemented

- **DB:** `topics.audio_script`, `topics.audio_duration_seconds` (migration `20260322120000_phase81_topics_audio_metadata.sql`).
- **Types:** `CuriosityAudioBlock` + **`LoadedCuriosityExperience.audio` is always `CuriosityAudioBlock | null`**.
- **Loader:** `getNormalizedAudioData()` — valid HTTP(S) `audio_url` only; transcript = script or lesson text; safe on all inputs.
- **Helpers:** `isValidAudioUrl`, `isAudioAvailable`, upload + public URL for Storage (`curiosity-audio` bucket, env override).
- **Draft persist:** `mapDraftToTopicRow` writes script + duration when present on `experience.audio`.
- **Docs:** `AUDIO_SYSTEM_ARCHITECTURE.md`.

## How audio is structured now

| When | Shape |
|------|--------|
| Valid `audio_url` in DB | `audio: { audioUrl, durationSeconds, transcript }` |
| Missing/invalid URL | `audio: null` |

Listen Mode: **`isAudioAvailable(data.audio)`**.

## What 8.2 will improve next

- UI polish (panel, controls, loading).
- Optional **Media Session** / accessibility.
- Storage **RLS** documentation and admin upload flows.
- Debounced or signed URLs if buckets are private.

## Setup

1. Run Supabase migrations (new columns).
2. Create bucket **`curiosity-audio`** (or set `NEXT_PUBLIC_SUPABASE_AUDIO_BUCKET`) and public read if using `getPublicUrl`.
3. Set `topics.audio_url` to a real **https** file URL for topics that should show Listen.
