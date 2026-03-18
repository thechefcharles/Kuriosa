# Audio generation & Listen completion (Phase 8.3)

Beginner-friendly map of **how narration is created**, **stored**, and **what happens when it ends** in the app.

---

## 1. How AI narration is generated (intended path)

**Server-only.** Nothing here runs in the browser.

| Step | What happens |
|------|----------------|
| **Script** | Plain text: preferably `topics.audio_script`, else title + lesson (same as batch TTS). |
| **TTS** | **`generateAudioFromScript()`** calls **OpenAI** by default, or **ElevenLabs** if `provider: "elevenlabs"` or `AUDIO_GENERATION_PROVIDER=elevenlabs`. |
| **Upload** | MP3 goes to Supabase Storage (`curiosity-audio`) via **`uploadCuriosityAudio`**. |
| **DB** | **`saveGeneratedAudioMetadata()`** sets `audio_url`, `audio_script`, `audio_duration_seconds`. |

**Developer command:** `npm run audio:generate-example -- --slug=<published-slug>`  
Chains generate + save for one topic.

**Manual upload** of a file URL into `audio_url` remains valid for edge cases, but **generated narration is the default workflow** as you scale (ideally wired from your content pipeline after scripts exist).

---

## 2. Provider config (light abstraction)

**`audio-provider-config.ts`** defines:

- Default generation provider: **OpenAI**
- **`resolveGenerationProvider()`** — OpenAI unless overridden
- Typed voice/model names for OpenAI; ElevenLabs reuses existing `synthesizeElevenLabsSpeechToMp3`

Batch script **`audio:tts-upload`** still uses **`TTS_PROVIDER`** env. **`generateAudioFromScript`** uses **`AUDIO_GENERATION_PROVIDER`** (or explicit `input.provider`) so you can keep batch on one provider and generation on another if needed.

---

## 3. Audio completion (Listen Mode)

- **`AudioPlayer`** fires **`onPlaybackEnded`** when the `<audio>` element hits **`ended`** (natural end).
- **No XP** and **no progress writes** on audio end — same as before.
- **`AudioCompleteCallout`** appears **only in Listen mode** after completion:
  - **With quiz:** **Continue to challenge** → `/challenge/[slug]`
  - **Without quiz:** short message to use Read / scroll down

User must **tap** the CTA; we do **not** auto-navigate.

Replay clears the callout (**`onPlaybackBegan`**).

---

## 4. Challenge & progress (source of truth)

| Event | Progress / XP |
|-------|----------------|
| Audio finishes | Nothing recorded |
| User opens challenge and completes flow | Existing Phase 5/6 behavior |

Listening is **not** a substitute for the challenge for scoring.

---

## 5. Mobile playback tweaks

- **`playsInline`** on `<audio>` (iOS-friendly)
- Larger tap targets on transport controls
- Clearer first-play / autoplay-block copy
- Callbacks use **refs** so the audio element is not torn down when parent re-renders

---

## 6. What 8.4 might finalize

- Admin UI to trigger generation per topic
- Media Session / lock screen (out of scope here)
- Stricter duration from decoded audio instead of bitrate heuristic

See also **`AUDIO_SYSTEM_ARCHITECTURE.md`**, **`LISTEN_MODE_ARCHITECTURE.md`**, **`TTS_NARRATION_PIPELINE.md`**.
