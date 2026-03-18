# Audio player architecture (Listen mode)

## What this is

Kuriosa’s **Listen mode** on `/curiosity/[slug]` uses a custom **`AudioPlayer`** built on the **HTML `<audio>`** element. It gives users **play / pause**, **±10s seek**, a **scrubber**, and **elapsed / total time** — without background playback, lock-screen controls, or a global cross-route player.

## Components

| Piece | File |
|-------|------|
| Listen shell + copy + transcript area | `src/components/curiosity/audio-panel.tsx` |
| Playback UI + element wiring | `src/components/curiosity/audio-player.tsx` |
| Time labels (`0:42`) | `src/lib/utils/format-audio-time.ts` |

## Who owns playback state

**`AudioPlayer`** owns all playback state in React (`useState` + `useRef` on the `<audio>` node):

- current time, duration (from `loadedmetadata`)
- playing vs paused (from `play` / `pause` events)
- buffering hint (`waiting` / `canplay`)
- user-facing errors (`error` event)

No global store, React Context, or route-level audio singleton — each mounted player is independent. Remounting (e.g. changing slug) resets playback via `key={slug}` on the player in **`AudioPanel`**.

## How it integrates with Listen mode

1. User switches to **Listen** on the curiosity page.
2. **`AudioPanel`** renders when `audioMode` is true.
3. If **`experience.audio.audioUrl`** exists (from persisted `topics.audio_url`), **`AudioPlayer`** is shown.
4. If there is no URL, a short **fallback message** appears; lesson text remains below on the page.

## Seeking and scrubbing

- **Rewind / Forward**: ±10 seconds, clamped to `[0, duration]`.
- **Scrubber**: `input type="range"` updates `audio.currentTime` while dragging; `timeupdate` keeps the label in sync when not scrubbing.

## Errors and loading

- Until metadata loads: **“Loading audio…”** and a spinner on the main button if the browser is buffering before play.
- **`error` event** or **`play()` rejection**: friendly message; page does not crash.
- Invalid or blocked URLs are handled the same way (browser-dependent).

## Transcript

If **`audio.transcript`** exists in the loaded experience, it appears under the player. There is **no word-level sync** with playback — structure is ready for richer transcript UX later.

## Intentionally not built (yet)

- Background audio after leaving the page
- Lock screen / media session controls
- Playlists or cross-route persistent player
- Analytics tied to listen completion

## Next prompt (5.6+)

Typically **challenge UI** and later loop steps (follow-ups, trails, progress) — see phase docs.
