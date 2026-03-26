# Stage 1 — Mobile packaging prep (summary)

**Scope:** Centralized API origin + shared `fetchApi`; migrate main app client hooks off relative `/api`. No static export, no Capacitor iOS, no auth rewrite.

## Implemented

- **`src/lib/config/api-origin.ts`** — `NEXT_PUBLIC_API_ORIGIN` or `window.location.origin`; `resolveClientApiUrl`; cross-origin credentials helper.
- **`src/lib/network/fetch-api.ts`** — `fetchApi`, `parseResponseJson`.
- **Migrated hooks/services:** progress completion, AI (manual + exploration), leaderboard (+ position), activity feed, public profile, privacy (GET/PATCH), share `record-share`, Sentry example page.
- **Docs:** `KURIOSA_MOBILE_NETWORKING_PREP.md`, `ENVIRONMENT_SETUP.md` (`NEXT_PUBLIC_API_ORIGIN`), `KURIOSA_MOBILE_PACKAGING_PLAN.md` (Stage 1 checkboxes partially complete).

## Intentionally unchanged

- Internal content-preview **form** actions (relative `/api/internal/...`).
- All Route Handler **implementations** (no business logic changes).
- Auth Server Actions + middleware.

## Next (Stage 2+)

- Client auth + guards; CORS if API origin ≠ page origin; static export strategy; Capacitor `webDir`.

## Suggested commit message

```
refactor(mobile): centralize API origin and migrate client fetches for Capacitor readiness
```
