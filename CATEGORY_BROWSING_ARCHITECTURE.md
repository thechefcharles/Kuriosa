# Category browsing (Phase 7.3)

## Flow

**Discover** → tap **CategoryCard** → **`/discover/category/[slug]`** → **CategoryScreen** → tap **TopicCard** → **`/curiosity/[slug]`** (full experience).

## Data

| Piece | Source |
|-------|--------|
| Category + topic list | **`getCategoryDetail`** → **`CategoryDetailView`** |
| Hook | **`useCategoryDetail(slug)`** |
| Query key | **`discoveryQueryKeys.categoryDetail(slug)`** |

`getCategoryDetail` loads the category row; **`getTopicsByCategory`** supplies **TopicCardView[]** (published only, max 50).

## UI

- **CategoryHero** — name, description, topic count, exploration copy.
- **CategoryTopicGrid** — **TopicCard** grid (same cards as Discover).
- **CategoryEmptyState** — category exists but no published topics.
- **Not found** — unknown slug.
- **Breadcrumb** — Discover / category name.

## Next (7.4)

Search, richer trails from category context, or filters — not in 7.3.
