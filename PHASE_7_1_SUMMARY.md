# Phase 7.1 — Discovery data layer & Topic Card

## Added

### View models (`src/types/discovery.ts`)

- **CategoryView**, **TopicCardView**, **RecentTopicView**

### Helpers (`src/lib/services/discovery/read/discovery-read-helpers.ts`)

- **mapCategoryToCategoryView**, **mapTopicToTopicCardView** (pure DB → UI)

### Services

| File | Purpose |
|------|---------|
| `get-categories.ts` | Categories ordered by `sort_order`; optional published topic counts |
| `get-topics-by-category.ts` | Published topics by category slug (max 50) |
| `get-featured-topics.ts` | `is_random_featured` first, else recent published (max 24) |
| `get-recent-topics.ts` | User rewarded completions, newest first (max 10) |

### Query keys

- **discoveryQueryKeys** in `query-keys.ts`

### Hooks

- **useCategories**, **useTopicsByCategory**, **useFeaturedTopics**, **useRecentTopics** (guest → empty recent)

### Components

- **TopicCard** — title, hook, category pill, **DifficultyLabel**, time, optional completed check; links to **`/curiosity/[slug]`**
- **CategoryCard** — name, optional count + one-line description; optional **href**

## Not in 7.1

- Full **Discover** screen, category routes, search, recommendations

## TopicCard usage

Import **`TopicCard`** anywhere discovery lists topics; pass **TopicCardView** from hooks/services. Override **href** only when needed.
