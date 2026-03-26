# Kuriosa — Static export enablement (Stage 3b / 4)

This pass makes a **real `out/`** static bundle possible **without** breaking the default Vercel **`next build`**.

---

## 1. How it works

| Build command | Behavior |
|---------------|----------|
| **`npm run build`** | Normal Next.js production build: **API routes**, **middleware**, **pretty** `/curiosity/[slug]`, `/internal`, etc. |
| **`npm run build:export`** | Runs `scripts/static-export-build.mjs`: **stashes** incompatible paths, sets **`STATIC_EXPORT=1`**, runs `next build` → **`out/`**, then **restores** the repo. |

`next.config.ts` applies **`output: "export"`** and **`images: { unoptimized: true }`** only when **`STATIC_EXPORT=1`**.

---

## 2. What gets stashed during `build:export` (and why)

| Path | Reason |
|------|--------|
| `src/app/api` | Route Handlers are **not supported** with `output: "export"`; APIs stay on **Vercel**. |
| `src/middleware.ts` | **Middleware** is incompatible with static export. Client **`ProtectedAppRoute`** gates the shell. |
| `src/app/internal` | Admin workflow; not needed in the consumer app; simplifies export. |
| `src/app/(app)/profile/[userId]` | Pretty public profile; static export uses **`/profile?userId=`** (`MOBILE_SAFE_ROUTES`). |
| `src/app/(app)/curiosity/[slug]` | Pretty curiosity; bundle uses **`/curiosity?slug=`**. |
| `src/app/(app)/challenge/[slug]` | Pretty challenge; bundle uses **`/challenge?slug=`**. |
| `src/app/(app)/discover/category/[slug]` | Pretty category; bundle uses **`/discover/category?slug=`**. |
| `src/app/(app)/progress/category/[slug]` | Pretty category; bundle uses **`/progress/category?slug=`**. |

Pretty segments are stashed (instead of relying on `generateStaticParams` + `dynamicParams` toggles) because Next’s static analysis requires **literal** segment config for reliable export, and we want **unchanged** web behavior on Vercel.

After restore, the working tree matches **`git`** — stashes live under **`.next-export-stash/`** (gitignored) only during the build.

---

## 3. What `out/` contains

Static HTML for the **marketing** landing, **auth**, **app shell** pages, and the Stage 3 **query** entry routes (e.g. `curiosity.html`, `challenge.html`, `discover/category/index.html`, nested `progress` routes). **No** `/api/*`, **no** pretty dynamic HTML files for topics/categories/profiles.

---

## 4. Capacitor `webDir`

**`capacitor.config.ts`** uses **`webDir: 'out'`**. Run **`npm run build:export`** before **`npx cap sync`**.

---

## 5. Sentry

Default **`withSentryConfig`** runs on both builds. If Sentry CLI upload fails in CI (network/auth), fix tokens or set CI env; export build does not add a separate Sentry disable flag in this pass.

---

## 6. Remaining blockers (moderate / follow-up)

| Topic | Notes |
|-------|--------|
| **Cross-origin session** | `fetchApi` + Supabase cookies when `NEXT_PUBLIC_API_ORIGIN` ≠ WebView origin — **CORS** / **SameSite** (documented in Stage 1–2 docs). |
| **Pretty URLs in the bundle** | Intentionally absent; use **`MOBILE_SAFE_ROUTES`** or mirror **`ROUTES`** on web only. |
| **Internal / admin** | Not in `out/`; use hosted web app for previews. |
| **Cron / server** | Unchanged on Vercel only. |

---

## 7. Stage 5 (Capacitor)

`npx cap add ios`, **`NEXT_PUBLIC_*`** in the **export** build env, device testing, ATS, deep links.

---

## 8. Related

- **`STAGE_4_STATIC_EXPORT_SUMMARY.md`**
- **`KURIOSA_MOBILE_ROUTING_AND_EXPORT_PREP.md`**
- **`scripts/static-export-build.mjs`**
