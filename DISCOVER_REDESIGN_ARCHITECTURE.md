# Discover Page Redesign Architecture

## Overview

The Discover page has been refactored to align with the Home screen philosophy: **one dominant action, one next best action, one escape hatch**. The page now feels like a guided browsing surface rather than a stacked list of sections.

---

## New Layout Structure

```
┌─────────────────────────────────────┐
│ 1. HEADER (compact)                 │
│    Browse                           │
│    Find something to explore        │
├─────────────────────────────────────┤
│ 2. HERO ZONE                        │
│    [Search topics…]                 │
│    Jump in (or Results for "X")     │
│    [Topic cards grid]               │
├─────────────────────────────────────┤
│ 3. SECONDARY: Category strip        │
│    Browse by category               │
│    [Horizontal scroll categories]   │
├─────────────────────────────────────┤
│ 4. TERTIARY: Recent strip           │
│    Pick up where you left off       │
│    [Compact list rows]              │
├─────────────────────────────────────┤
│ 5. TERTIARY: More picks (cond.)     │
│    More picks                       │
│    [Topic cards]                    │
├─────────────────────────────────────┤
│ 6. TERTIARY: Surprise strip         │
│    Prefer a surprise?               │
│    [Difficulty pills + button]      │
└─────────────────────────────────────┘
```

---

## Hierarchy Decisions

| Priority | Element | Treatment |
|----------|---------|-----------|
| **Primary** | Search + Jump in | Hero zone. Most vertical space. Search always visible. Topic grid or search results in same area. |
| **Secondary** | Categories | Compact strip. Horizontal scroll. Lighter visual weight (`rounded-2xl border bg-background/70`). |
| **Tertiary** | Recent | Compact list. Max 5 items. Same strip styling. |
| **Tertiary** | More picks | Conditional. Only when suggested topics exist and are distinct from Jump in. |
| **Tertiary** | Surprise me | Same treatment as Home. Compact strip with difficulty pills + Feed my curiosity. |

---

## Alignment with Home

| Home | Discover |
|------|----------|
| Compact header (eyebrow + one line) | Compact header (Browse / Find something to explore) |
| Hero: daily curiosity card | Hero: search + Jump in grid |
| Secondary: Prefer a surprise? | Secondary: Browse by category |
| Tertiary: Browse all topics link | Tertiary: Recent, More picks, Surprise me |
| max-w-md, space-y-4 | max-w-md, space-y-4 / mb-4 |
| Tap-first, less reading | Tap-first, less reading |

---

## Component Structure

```
DiscoverScreen
├── DiscoverHeaderCompact
├── DiscoverHeroZone
│   ├── Search input
│   └── Jump in grid (or search results)
├── DiscoverCategoryStrip
├── DiscoverRecentStrip
├── DiscoverMoreStrip (conditional)
└── DiscoverSurpriseStrip
```

**Shared components reused:**
- `TopicCard`
- `CategoryCard` (with `compact` prop for strip)
- `FeedMyCuriosityButton` (with `compact` prop)
- `DiscoverySectionSkeleton`, `DiscoverySectionEmpty`, `DiscoverySectionError`, `DiscoveryCardGrid`

---

## Search Behavior

- **Placeholder:** "Search topics…"
- **Trigger:** 2+ characters
- **When searching:** Hero zone shows "Results for X" and search results grid
- **When not searching:** Hero zone shows "Jump in" and featured topics grid
- **No separate results page** — same layout, content swaps

---

## Mobile-First Details

- **Container:** `max-w-md` for strong mobile feel on desktop
- **Tap targets:** Recent rows `min-h-[44px]`; topic cards remain large
- **Horizontal scroll:** Categories use `overflow-x-auto` with `-webkit-overflow-scrolling: touch`
- **Spacing:** `space-y-4` / `mb-4` between zones; `mb-6` before bottom nav
- **Search active:** Tertiary sections get `opacity-75` to de-emphasize (optional visual cue)

---

## Files

### Created
- `src/components/discovery/discover-header-compact.tsx`
- `src/components/discovery/discover-hero-zone.tsx`
- `src/components/discovery/discover-category-strip.tsx`
- `src/components/discovery/discover-recent-strip.tsx`
- `src/components/discovery/discover-more-strip.tsx`
- `src/components/discovery/discover-surprise-strip.tsx`

### Modified
- `src/components/discovery/discover-screen.tsx` — refactored to use new components
- `src/components/discovery/category-card.tsx` — added `compact` prop

### Unchanged (behavior preserved)
- Search logic, category filtering, random curiosity, progress badges
- `TopicCard`, `DiscoverySectionBody` components
- Hooks: `useSearchTopics`, `useFeaturedTopics`, `useCategories`, `useRecentTopics`, `useSuggestedTopics`
