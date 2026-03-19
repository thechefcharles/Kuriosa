# Phase 7 → Phase 8 handoff

## What Phase 7 completed

- **Discover** as the hub: search, categories, featured row, recent finishes, suggested row (deduped from featured), random CTA.
- **Category pages** with breadcrumbs, hero, topic grid, empty and error paths.
- **Topic cards** as the shared visual + navigation unit into `/curiosity/[slug]`.
- **Curiosity lesson** flow with **post-challenge** area: follow-ups + **trail cards** to the next topic.
- **Deterministic** suggestion and search rules — **no** personalization engine, **no** AI recommendations.
- **Query invalidation** after signed-in completion for **progress** plus **discovery recent & suggested**.

## What Phase 8 can rely on

- **Stable routes:** `/discover`, `/discover/category/[slug]`, `/curiosity/[slug]`, `/challenge/[slug]`, `#whats-next`.
- **Stable view models:** `TopicCardView`, `CategoryView`, `RecentTopicView`, `LoadedCuriosityExperience` (+ trails/followups).
- **Stable hooks:** discovery queries keyed by user/search slug as documented in `query-keys.ts`.
- **Completion contract:** completing a curiosity updates progress API; client invalidates progress + relevant discovery reads.

## Discovery assumptions to treat as stable

- Published-only surfacing for discovery lists.
- Recent topics = **rewarded** completions in history (not “viewed”).
- Suggested topics = rules in `get-suggested-topics.ts` (categories from recent + wildcard + featured pad, or featured for guests).

Changing these without updating **copy**, **tests**, and **Phase 8 monetization touchpoints** (e.g. paywalls on “next” content) could confuse users.

## What not to change casually before Phase 8

- **Completion / progress pipeline** (API + invalidation) — monetization often hooks eligibility or entitlements here.
- **`#whats-next` anchor** — challenge handoff and bookmarks may depend on it.
- **TopicCard → curiosity** navigation shape.

Phase 8 (e.g. subscriptions, premium trails) should **extend** these systems rather than replacing discovery types wholesale.
