# Phase P1.5 — Discover Page Redesign Summary

## Overview

Redesigned the Discover page to match the Home screen philosophy: one dominant action, reduced cognitive load, mobile-first layout, and faster scanning. The page now feels like a guided browsing surface instead of a stacked list of sections.

---

## 1. Summary of Changes

### Layout
- **Compact header:** Replaced large centered "Explore / Discover / Search, browse…" with left-aligned "Browse" / "Find something to explore"
- **Hero zone:** Search bar + Jump in (featured topics) combined as primary area
- **Search flow:** When searching, same zone shows "Results for X" — no separate results page feel
- **Category strip:** Horizontal scroll, lighter styling, "Browse by category" only
- **Tertiary strips:** Recent, More picks, Surprise me — all de-emphasized with consistent strip styling

### Copy Simplification
- Header: "Search, browse by category, or jump in" → "Find something to explore"
- Jump in: Removed "Hand-picked curiosities"
- Categories: Removed "Pick a lane"
- Recent: "Curiosities you've finished…" → "Pick up where you left off"
- Surprise me: Removed "Let the app pick one for you" (matches Home)
- Search results: "Matches for X in titles, tags…" → "Results for X"

### Component Structure
- `DiscoverHeaderCompact` — eyebrow + title
- `DiscoverHeroZone` — search + Jump in or results
- `DiscoverCategoryStrip` — horizontal scroll categories
- `DiscoverRecentStrip` — compact recent list
- `DiscoverMoreStrip` — conditional, "More picks"
- `DiscoverSurpriseStrip` — same as Home (Feed my curiosity, compact)

---

## 2. New Layout Structure

1. **Header** — compact, left-aligned
2. **Hero zone** — search + Jump in / search results
3. **Category strip** — horizontal scroll
4. **Recent strip** — compact list (max 5)
5. **More strip** — conditional
6. **Surprise strip** — Feed my curiosity

---

## 3. Hierarchy

| Priority | Element |
|----------|---------|
| Primary | Search + Jump in |
| Secondary | Categories |
| Tertiary | Recent, More picks, Surprise me |

---

## 4. UI Simplification

- Removed long section descriptions
- Removed duplicate labels
- Shortened all microcopy
- Single visual treatment for tertiary strips
- Category cards: added `compact` prop to hide description in strip

---

## 5. Component Changes

| Component | Change |
|-----------|--------|
| `DiscoverScreen` | Refactored to compose new strip components |
| `DiscoverHeaderCompact` | New — compact header |
| `DiscoverHeroZone` | New — search + Jump in |
| `DiscoverCategoryStrip` | New — horizontal categories |
| `DiscoverRecentStrip` | New — compact recent |
| `DiscoverMoreStrip` | New — conditional more |
| `DiscoverSurpriseStrip` | New — matches Home |
| `CategoryCard` | Added `compact` prop |

---

## 6. Files Created or Modified

### Created
- `src/components/discovery/discover-header-compact.tsx`
- `src/components/discovery/discover-hero-zone.tsx`
- `src/components/discovery/discover-category-strip.tsx`
- `src/components/discovery/discover-recent-strip.tsx`
- `src/components/discovery/discover-more-strip.tsx`
- `src/components/discovery/discover-surprise-strip.tsx`
- `DISCOVER_REDESIGN_ARCHITECTURE.md`
- `PHASE_P1_5_DISCOVER_SUMMARY.md`

### Modified
- `src/components/discovery/discover-screen.tsx`
- `src/components/discovery/category-card.tsx`

---

## 7. Manual Steps

None. All changes are code-only.

---

## 8. Verify Locally

1. **Discover page:** Compact header, search at top, Jump in below
2. **Search:** Type 2+ chars → results replace Jump in grid
3. **Categories:** Horizontal scroll, compact cards
4. **Recent:** Compact list when signed in; sign-in prompt when not
5. **More picks:** Only visible when suggested topics exist
6. **Surprise me:** Same as Home — compact strip with pills + button
7. **Navigation:** All links work; topic/category routes unchanged
8. **Mobile:** Test on narrow viewport; tap targets feel adequate

---

## 9. Notes / Risks

- **Search:** Uses same `useSearchTopics` hook; 2-char minimum unchanged
- **Dedupe:** `dedupeSuggestedAgainstFeatured` still prevents duplicate topics in Jump in + More
- **Category screen:** Unchanged; still uses full `CategoryCard` (no compact)

---

## 10. Suggested Commit Message

```
refactor(discover): align with Home UX — hero zone, compact strips

- Compact header: Browse / Find something to explore
- Hero: search + Jump in (or results) as primary
- Category strip: horizontal scroll, lighter weight
- Tertiary: Recent, More picks, Surprise me — compact strips
- New components: DiscoverHeaderCompact, DiscoverHeroZone, etc.
- CategoryCard: compact prop for strip layout
- Copy simplified across sections
```
