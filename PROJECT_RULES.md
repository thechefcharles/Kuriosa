# Kuriosa Project Rules

- **TypeScript everywhere** — No JavaScript in source; strict types.
- **No business logic in UI components** — Keep components presentational; use hooks, services, route handlers for logic.
- **Service logic belongs in `lib/services`** — Data access and business logic live in service layers, not components.
- **Hooks consume service/data logic** — Hooks wrap services and expose data to UI; UI does not call services directly.
- **Keep routes thin** — Route handlers and pages delegate to services/hooks; avoid inline business logic.
- **Keep components small and reusable** — Prefer composition over large monolithic components.
- **Phase discipline** — Do not implement features outside the current phase scope.
- **Prefer explicit code over clever abstractions** — Readable, maintainable code first.
- **Document important architecture decisions** — Use summary files (e.g. `*_SUMMARY.md`, `*_ARCHITECTURE.md`) for key patterns.
- **Modular folder structure** — Maintain `app/`, `components/`, `lib/`, `hooks/`, `types/` organization.
