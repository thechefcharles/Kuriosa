# Stage 4 — Static export enablement (summary)

## What works

- **`npm run build`** — unchanged Vercel/server deployment (API + middleware + pretty routes).
- **`npm run build:export`** — produces **`out/`** via `scripts/static-export-build.mjs` (stash → `STATIC_EXPORT=1` `next build` → restore).
- **`capacitor.config.ts`** → **`webDir: 'out'`**.

## Key implementation

- Conditional **`output: "export"`** + **`images.unoptimized`** in **`next.config.ts`** when **`STATIC_EXPORT=1`**.
- Stash list: **`api`**, **`middleware.ts`**, **`internal`**, pretty **`[slug]` / `[userId]`** segments (see **`KURIOSA_STATIC_EXPORT_ENABLEMENT.md`**).

## Suggested commit message

```
refactor(mobile): enable static export path and fix blockers for Capacitor readiness
```

## Next

Capacitor iOS, env for export builds, CORS/session hardening.
