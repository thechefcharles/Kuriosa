# Phase 7 — Discovery system inventory

Practical map of everything **Phase 7** added for browsing, searching, and continuing curiosity trails. Use this when onboarding a developer or planning Phase 8+.

---

## Discovery data layer

| Piece | Role |
|-------|------|
| **Supabase** | Published `topics`, `categories`, `topic_tags`, trail/follow-up tables (see `DATABASE_SCHEMA.md`). |
| **Services** (`src/lib/services/discovery/`) | Read-only assembly: categories, topics-by-category, featured, recent completions, search, suggested topics. |
| **Curiosity load** (`src/lib/services/curiosity/` or loaders) | Builds `LoadedCuriosityExperience` including `trails` and `followups`. |
| **`filter-exploration-entries.ts`** | Drops invalid trail links (missing slug, loop to current topic) and empty follow-up rows before UI. |
| **`dedupe-discover-topics.ts`** | Dedupes suggested cards against featured on Discover. |

---

## Topic card system

- **Type:** `TopicCardView` (`src/types/discovery.ts`) — id, slug, title, hook, category, difficulty, minutes, optional completion flag.
- **Component:** `TopicCard` — links to `/curiosity/[slug]`.
- Used on: Discover (featured, search, suggested), category grids, internal previews.

---

## Discover screen (`/discover`)

- **Search** — 2+ characters; title, hook, tags, category name/slug; max 20 results.
- **Browse by category** — cards with counts → `/discover/category/[slug]`.
- **Jump in here** — featured / fallback recent-published slice.
- **Recently explored** — signed-in rewarded completions; signed-out CTA to sign in.
- **More to explore** — rule-based suggestions, **deduped** against Jump in row.
- **Surprise me** — random published topic CTA.

---

## Category browsing

- **Route:** `/discover/category/[slug]`.
- **CategoryScreen** — hero + topic grid or **empty state** (Discover + Home links).
- **Errors** — friendly message + Back to Discover.

---

## Search, recent, suggested (hooks)

| Hook | Query key (conceptually) |
|------|---------------------------|
| `useSearchTopics(q)` | `discovery.search` + normalized query |
| `useRecentTopics` | `discovery.recent` + user id |
| `useSuggestedTopics` | `discovery.suggested` + user or `guest` |

After a **signed-in completion**, `recent` and `suggested` are **invalidated** so lists update.

---

## Curiosity trail navigation

- **Trail data:** `CuriosityTrail` — `toTopicSlug`, `toTopicTitle`, `reasonText`, `sortOrder`.
- **TrailCard** — “Next curiosity”, title, “Why next: …”, chevron affordance, tap to open.
- **TrailSection** — list of valid trails, or empty states (natural end vs broken links) + Discover link.

Self-links and empty slugs are **filtered** before rendering.

---

## Post-challenge exploration (`#whats-next`)

- **PostChallengeExploration** — header **What’s next?**; two bands:
  - **Dig deeper** — follow-up Q&A (`FollowupSection`).
  - **Keep going** — trail cards (`TrailSection`).
- **Challenge → lesson:** “See what’s next” records completion (when applicable) and navigates to `#whats-next`.
- **Fully empty topic** (no follow-ups, no trails): single panel with Discover + Home.

---

## Edge-case protections (high level)

| Situation | Behavior |
|-----------|----------|
| Category with no topics | Empty state + links |
| Search no matches | Empty state + hints |
| Signed-out recent | Sign-in CTA |
| Sparse DB | Sections hide or empty states; no blank shell |
| Invalid trail targets | Filtered; if all bad, explanatory empty + Discover |
| No follow-up text | Treated as empty; message if raw rows exist |
| Section fetch error | Inline error; other sections still work |

---

## Files to skim first

- `src/components/discovery/discover-screen.tsx`
- `src/components/discovery/category-screen.tsx`
- `src/components/curiosity/post-challenge-exploration.tsx`
- `src/lib/query/query-keys.ts` + `invalidate-progress-queries.ts`
- `DISCOVERY_SEARCH_AND_SUGGESTIONS.md`
