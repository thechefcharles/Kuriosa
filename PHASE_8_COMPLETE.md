# Phase 8 — Complete

**Status:** Phase 8 (Audio System & Listen Mode) is **closed** as of prompt **8.4**.

## Stable systems

- Listen availability from normalized `audio_url`
- Read-first fallback when audio is missing or fails
- Server-side TTS pipeline (OpenAI / ElevenLabs) + Storage + DB metadata
- Transcript / lesson fallbacks in Listen UI
- Audio completion → challenge CTA (no duplicate XP path)
- Edge-case handling: invalid URL, load errors, play() rejection, debounced `ended`

## Next phase

**Phase 9** — see **`PHASE_8_HANDOFF_TO_PHASE_9.md`** for boundaries and what not to regress.

## Before moving on — developer checklist

- [ ] `npx tsc --noEmit` passes
- [ ] One topic with a real `audio_url`: Listen plays end-to-end
- [ ] Same topic with `audio_url` removed or broken: Read works; Listen error is calm
- [ ] After audio ends on a topic with challenge: CTA appears once; replay hides until finished again
- [ ] `npm run audio:generate-example` (or upload script) still runs with your env

---

*Detail: **`PHASE_8_AUDIO_SYSTEM_INVENTORY.md`** · Closure notes: **`PHASE_8_4_SUMMARY.md`***
