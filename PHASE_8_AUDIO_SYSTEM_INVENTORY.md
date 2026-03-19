# Phase 8 — Audio System Inventory

Beginner-friendly map of what Phase 8 built. **Listen** is optional; **Read** is always safe.

---

## 1. Data contract (MVP)

| Condition | Behavior |
|-----------|----------|
| `topics.audio_url` is a valid **http/https** URL | **Listen** is offered; loader exposes `audio` with `audioUrl`, optional `durationSeconds`, optional `transcript`. |
| Missing or invalid URL (wrong scheme, empty) | No Listen button; experience is read-only for audio. |
| URL valid but file 404 / network error | Player shows a calm error + “Try loading audio again”; user can **Read** normally. |

**Intended path:** generated audio (TTS → Storage → DB). **Fallback:** manual upload or paste URL into `audio_url`.

---

## 2. Audio data pipeline

1. **DB:** `audio_url`, `audio_script`, `audio_duration_seconds` (and lesson text for fallback).
2. **Normalization:** `getNormalizedAudioData` (`src/lib/services/audio/audio-metadata.ts`) — pure, never throws; validates URL shape; transcript = script if present, else lesson text when URL is valid.
3. **Loader:** `loadCuriosityExperience` attaches normalized `audio` or omits it when not listen-ready.
4. **Client:** `isAudioAvailable` / Listen toggle; `AudioPanel` only renders player when `audio` exists.

---

## 3. Storage & generation (server-side)

- **Upload:** helpers under `src/lib/services/audio/` (bucket default `curiosity-audio`).
- **TTS:** `generateAudioFromScript` — **OpenAI** or **ElevenLabs** via env (`AUDIO_GENERATION_PROVIDER`, `TTS_PROVIDER`, keys). **Do not move TTS to the client.**
- **Persist URL:** `saveGeneratedAudioMetadata` updates `topics.audio_url` (+ optional duration/script).
- **Scripts:** `npm run audio:generate-example`, `npm run audio:tts-upload`, `npm run audio:tts-backfill-all`.

---

## 4. Listen Mode UX

- **Mode toggle:** Read / Listen; without audio, Listen is a dashed “read works · audio optional” slot.
- **Audio panel:** Title, player, optional “about N min” if duration known, transcript collapsible, **completion callout** after natural end.
- **Read while listening:** Player can stay mounted off-screen in Read mode (same session); leaving the page stops playback (no background audio in Phase 8).

---

## 5. Transcript

- Prefer `audio_script`; else lesson text when URL is valid.
- UI also falls back to **lesson body** if transcript string is still empty (edge data).
- If nothing to show: short copy pointing to the written lesson — no broken empty chrome.

---

## 6. Audio player

- HTML5 `<audio>`, single instance per slug (`key={slug}`).
- Loading / buffering copy; unknown duration shows “—” for total time.
- **Errors:** non-alarming copy + retry; play promise failures recoverable with another tap.
- **Completion:** debounced `ended` so the challenge CTA doesn’t double-fire from duplicate events.

---

## 7. Completion → challenge handoff

- **After narration ends:** `AudioCompleteCallout` — if topic has a challenge, link to `/challenge/[slug]`; copy matches “optional check-in” tone (XP still flows through the existing challenge path, not from audio alone).
- **Replay:** Starting play again clears “finished” state so the callout hides until they complete again.

---

## 8. Edge-case protections

| Case | Handling |
|------|----------|
| No `audio_url` | Listen hidden; read-first. |
| Bad/unreachable URL | Player error UI; Read unaffected. |
| No transcript | Lesson fallback or clear hint. |
| No duration | Player works; time total shows “—”. |
| Malformed celebration in sessionStorage | `consumeCompletionCelebration` validates + clears bad data. |

---

## 9. Key files (reference)

| Area | Files |
|------|--------|
| Normalize | `audio-metadata.ts`, `is-valid-audio-url.ts` |
| Load | `load-curiosity-experience.ts` |
| Player | `audio-player.tsx`, `audio-panel.tsx` |
| Toggle / screen | `mode-toggle.tsx`, `curiosity-experience-screen.tsx` |
| Completion UI | `audio-complete-callout.tsx` |
| TTS | `generate-audio-from-script.ts`, `synthesize-narration.ts`, `save-generated-audio-metadata.ts` |

---

## 10. Workflow: one topic end-to-end

1. Set `.env.local` (OpenAI and/or ElevenLabs + Supabase service role for upload).
2. Run `npm run audio:generate-example` (or TTS upload script for your slug) so audio lands in Storage and DB is updated.
3. Visit `/curiosity/<slug>` → **Listen** → confirm playback; toggle **Read** → confirm lesson still readable.
4. Optional: break URL in DB temporarily → confirm graceful player error + Read still works.

---

## 11. Out of scope (Phase 8)

Background playback, lock screen / Media Session as product features, global cross-route player, admin UI for bulk audio — documented as future work in **`PHASE_8_HANDOFF_TO_PHASE_9.md`**.
