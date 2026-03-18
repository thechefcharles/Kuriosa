# Curiosity Experience Page Architecture

## What this page is

The Curiosity Experience page is the user-facing lesson screen at:

- `/curiosity/[slug]`

It loads a curiosity topic by `slug`, then renders a premium “article-like” reading surface with a **Read** vs **Listen** mode toggle.

At this stage (Phase 5.4), the page is focused on content display and audio-ready scaffolding:

- Read Mode is fully implemented for lesson text + facts.
- Listen Mode has the correct layout and “audio-ready” section, but it does **not** implement a full audio player yet.
- Challenge UI and completion tracking are not implemented yet.

## Route entry point

- `src/app/(app)/curiosity/[slug]/page.tsx`

This file is a thin route wrapper. It extracts `slug` from route params and renders the client screen component.

## Main screen component

- `src/components/curiosity/curiosity-experience-screen.tsx`

Responsibilities:

1. calls `useCuriosityExperience(slug)` (from Phase 5.1)
2. shows loading / error / not-found states
3. manages the `mode` UI state (`read` vs `listen`)
4. composes the smaller presentational components

No database logic exists in the page UI components.

## Components

- `curiosity-header.tsx`
  - title
  - hook question
  - category + estimated time
  - difficulty label

- `mode-toggle.tsx`
  - two buttons: **Read** and **Listen**
  - Listen is disabled when the loaded curiosity has no `audioUrl`

- `audio-panel.tsx` (Listen scaffold)
  - when Listen mode is active:
    - shows a simple “audio is ready” card if `audio.audioUrl` exists
    - otherwise shows “Audio isn’t available…”
  - no transport controls are implemented yet

- `lesson-content.tsx`
  - renders lesson text with paragraph splitting for readability
  - shows:
    - “Surprising fact” if present
    - “Why it matters” (real-world relevance) if present

- `next-step-callout.tsx`
  - a small CTA at the bottom:
    - “Ready for the challenge?”
    - links to `/challenge/[slug]` (challenge UI not implemented yet, but route exists)

## Data expectations

The UI consumes `LoadedCuriosityExperience` from `src/types/curiosity-experience.ts`.

Important optional handling:

- `experience.audio` may be missing
- `lesson.surprisingFact` may be missing
- `lesson.realWorldRelevance` may be missing

The UI conditionally renders those sections, so missing optional content never crashes the page.

## What 5.5 will add next

Phase 5.5 will extend the curiosity loop by adding the **challenge UI** on the next step route, and then the remaining follow-up/trails sections as defined in later prompts.

