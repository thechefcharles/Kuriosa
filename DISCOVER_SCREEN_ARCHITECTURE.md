# Discover screen (Phase 7.2)

## Structure

**`DiscoverScreen`** (`src/components/discovery/discover-screen.tsx`) orchestrates the hub. Layout pieces:

| Component | Role |
|-----------|------|
| **DiscoverySection** | Section wrapper + scroll margin |
| **DiscoverySectionHeader** | Title, optional description, optional CTA link |
| **DiscoverySectionSkeleton / Empty / Error** | Per-section states |
| **DiscoveryCardGrid** | Responsive grid for **TopicCard**s |

## Sections (top → bottom)

1. **Browse by category** — **`useCategories({ withTopicCounts: true })`** + **CategoryCard** → **`/discover/category/[slug]`** (full browse in 7.3).
2. **Jump in here** — **`useFeaturedTopics()`**, first **6** topics as **TopicCard** → **`/curiosity/[slug]`**.
3. **Pick up where you left off** — **`useRecentTopics()`** (signed-in, rewarded completions). Row links to curiosity. Guests see sign-in empty state.
4. **Explore more** — Shown only if **7+** featured topics exist: **items 7–12** from the same **`getFeaturedTopics`** list (deterministic, **no ML**). Documents the “second page” of the featured pool.
5. **Surprise me** — **FeedMyCuriosityButton** (existing random flow).

## Hooks & services (7.1)

All data via **useCategories**, **useFeaturedTopics**, **useRecentTopics** — no inline Supabase.

## Intentionally simple

- No search, no category topic grid (7.3), no recommendations.
- **Explore more** is literally **`featured.slice(6, 12)`** so the page stays lively when the catalog is deep enough.

## Next (7.4+)

Search, filters, or trail context from category — see **`CATEGORY_BROWSING_ARCHITECTURE.md`**.
