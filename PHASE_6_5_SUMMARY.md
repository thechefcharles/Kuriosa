# Phase 6.5 — Progress & profile UI + celebration

## Implemented

- **Progress dashboard** (`/progress`) — hero, streak, stat grid, badge grid; Kuriosa gradients; mobile-first.
- **Reusable components** under `src/components/progress/` (hero, level bar, streak, stats, badges, dashboard, celebration card).
- **Profile hub** — identity + level/score/streak + recent badges + link to progress.
- **Completion flow** — stash celebration on Continue → show **`CompletionCelebrationCard`** on **`#whats-next`** via **`CompletionCelebrationHost`**.
- Removed **6.4 verification panel**.
- **`PROGRESS_UI_ARCHITECTURE.md`**.

## Setup

Sign in, complete a curiosity, open **Progress** / **Profile**. Use **Continue exploring** to see celebration when XP or badges change.

## Next (6.6)

Polish, motion, copy tests, optional deeper QA.
