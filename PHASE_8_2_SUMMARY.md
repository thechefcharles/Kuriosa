# Phase 8.2 summary — Listen Mode UX

## Implemented

1. **Mode toggle** — Fieldset + helper copy; **Read** / **Listen** with icons; **Listen** disabled state replaced by an obvious **read-only** panel when there’s no audio (`Headphones` + “No audio yet · read below”).
2. **Listen surface** — Strong **Listen mode** header (title repeated for context), player in a raised card, spacing tuned for **mobile**.
3. **Persistent playback** — Player stays **mounted off-screen** in Read mode so switching modes **doesn’t reset** audio on the same page.
4. **Transcript** — **`TranscriptCollapsible`**: short text default **open**, long default **closed**; tap to expand/collapse; scrollable panel; empty transcript shows friendly hint.
5. **Written lesson in Listen** — **“Written lesson”** label, **scroll-limited** body so narration stays primary; supporting sections (surprising fact, etc.) follow below.
6. **Safety** — If `hasAudio` becomes false while on Listen, mode resets to Read.
7. **Docs** — **`LISTEN_MODE_ARCHITECTURE.md`**.

## How Listen Mode behaves now

- Default **Read**; **Listen** only when `audio_url` is valid.
- Listen = narration-first layout; Read = full lesson typography.
- Same audio element across mode switches until navigation away.

## What 8.3 will do next

- Media Session / OS controls, possible background play, polish on errors and loading — per roadmap.

## Not changed (per prompt)

- Storage, TTS pipeline, `audio` data shape, challenge / completion flows.
