# Listen Mode architecture (Phase 8.2)

Beginner-friendly guide to **Read vs Listen** on the curiosity page.

## Read vs Listen

| Mode | What you see |
|------|----------------|
| **Read** (default) | Title, hook, lesson, challenge flow — normal reading. |
| **Listen** | Same curiosity, but a **Listen surface** is primary: big player, optional transcript, written lesson in a **compact scrollable** block below. |

- **Listen** only appears as a real button when the topic has **valid audio** (`isAudioAvailable`). Otherwise you see a **friendly “no audio yet”** slot so nothing feels broken.
- If data loads without audio while Listen was selected, the UI **snaps back to Read** (safety).

## How mode switching feels

- It’s **one page** — you’re not navigating away.
- **Playback:** The **same** `<audio>` instance stays mounted when you switch **Listen → Read** (player moves off-screen). Audio **keeps playing** until the user pauses or leaves the page. When they open **Listen** again, the same position and play/pause state are there.
- **Transcript** open/closed state resets when the transcript text changes (e.g. new topic). Toggling Read/Listen does not need to reset transcript.

## Transcript expand / collapse

- Source: **`audio.transcript`** from the loader (dedicated script or lesson fallback).
- **Short** transcript (about **≤420 characters**): **expanded by default**.
- **Longer**: **collapsed by default**; user taps **Transcript** to read along or hide it.
- No word-level sync with audio (out of scope).

## Missing audio

- **Listen** is not a dead button — it’s a clear **“No audio yet · read below”** area with headphones icon and tooltip-style explanation.
- **Read** stays fully usable; nothing is hidden behind Listen.

## Mobile

- Mode control: **large tap targets** (min height ~44px).
- Listen surface: extra padding around the player; transcript in a **scroll-limited** area so the page doesn’t become endless text.

## What 8.3 might add

- **Media Session** (lock screen / OS controls).
- **Background** or cross-route playback (global player — not in 8.2).
- Optional **signed URLs** or streaming tweaks if Storage goes private.

See also **`AUDIO_SYSTEM_ARCHITECTURE.md`** for data and URLs.
