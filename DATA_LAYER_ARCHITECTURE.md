# Data Layer Architecture

## Overview

Kuriosa uses **React Query** for client-side data fetching. The architecture separates concerns across service functions, hooks, and UI components.

## Structure

- **React Query** — Manages caching, loading states, and error handling for async data
- **Service layer** (`src/lib/services/`) — Performs Supabase (or API) calls; no UI logic
- **Hooks** (`src/hooks/queries/`) — Wrap service calls with `useQuery`; expose `data`, `isLoading`, `error`
- **UI components** — Consume hooks and render based on state (loading, error, success)

## Data Flow

```
UI Component → useTopics() → Service (future) → Supabase
                   ↓
            React Query (cache, refetch)
```

## Benefits

- **Separation of concerns** — Services handle data access, hooks provide React integration, UI stays presentational
- **Caching** — React Query caches responses and reduces redundant network calls
- **Error handling** — Centralized error states for loading and failure
- **Scalability** — Easy to add new queries and mutations without changing UI patterns

## Configuration

- `src/lib/query/query-client.ts` — Default query options (retry, staleTime)
- `src/components/shared/query-provider.tsx` — Wraps the app with `QueryClientProvider`
