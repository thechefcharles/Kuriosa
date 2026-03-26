# Kuriosa — Mobile routing & static export prep (Stage 3)

Builds on **Stage 1** (API origin / `fetchApi`) and **Stage 2** (client auth + `ProtectedAppRoute`). This stage adds **additive, query-param “shell” routes** so a future **`output: 'export'`** build can emit a **finite** set of HTML entry points while **topic/category/user identity** comes from the query string + client data (hosted APIs / Supabase).

---

## 1. Strategy

| Goal | Approach |
|------|-----------|
| Growing catalog / no rebuild per slug | Do **not** rely on `generateStaticParams` for every topic. |
| Pretty URLs for web | Keep **`/curiosity/[slug]`**, **`/challenge/[slug]`**, **`/discover/category/[slug]`**, **`/progress/category/[slug]`**, **`/profile/[userId]`** unchanged. |
| Finite paths for static shell | Add **sibling** `page.tsx` files that serve **`/curiosity`**, **`/challenge`**, **`/discover/category`**, **`/progress/category`** with **`?slug=`** or **`?userId=`** (profile). |
| Code reuse | Same screen components as pretty routes (`CuriosityExperienceScreen`, `ChallengeScreen`, `CategoryScreen`, `CategoryProgressScreen`, `PublicProfileLayout`). |

**Route helpers:** `ROUTES.*` = pretty paths for links & SEO. **`MOBILE_SAFE_ROUTES`** in `src/lib/constants/routes.ts` = query URLs for Capacitor / export builds.

---

## 2. Mobile-safe routes (additive)

| Screen | Query entry | Pretty entry (unchanged) |
|--------|-------------|---------------------------|
| Curiosity | `/curiosity?slug=…` (+ optional `&from=discover`) | `/curiosity/[slug]` |
| Challenge | `/challenge?slug=…` | `/challenge/[slug]` |
| Discover category | `/discover/category?slug=…` | `/discover/category/[slug]` |
| Progress category | `/progress/category?slug=…` | `/progress/category/[slug]` |
| Public profile | `/profile?userId=…` | `/profile/[userId]` |

**Own profile hub** remains **`/profile`** with **no** `userId` query. Middleware + `ProtectedAppRoute` treat **`/profile?userId=…`** as **public** (same rules as **`/profile/:id`**), via **`src/lib/routing/profile-access.ts`**.

---

## 3. Shared pieces

- **`PublicProfileLayout`** — wraps **`ProfileScreen`**; used by **`/profile/[userId]`** (still a thin async server page) and **`/profile?userId=`** branch.
- **`isPublicProfileAccess`** — single source for “public profile” in **middleware** and **`ProtectedAppRoute`** (pretty path **or** `userId` query on **`/profile`**).
- **Middleware** — protects **`/curiosity`** and **`/challenge`** (exact + nested); sign-in **`redirect`** now includes **query string** so `?slug=` is preserved after login.

---

## 4. Server / metadata (unchanged on pretty routes)

- **`/curiosity/[slug]`** still uses **`generateMetadata`** + service-role helper — **fine for web**; the **query** `/curiosity` page is **client-only** with default document title.
- **Route Handlers**, **cron**, **internal** tools — unchanged; they **do not** ship in a static export.

---

## 5. Export readiness (updated)

**`npm run build:export`** now produces **`out/`** by stashing API, middleware, internal admin, and **pretty** dynamic segments for the duration of the build. See **`KURIOSA_STATIC_EXPORT_ENABLEMENT.md`**.

Remaining product/infra work: **CORS / cookies** for cross-origin `fetchApi`, Capacitor iOS, and env wiring for export CI.

---

## 6. Stage 5 (Capacitor / device)

- `npx cap add ios`, **`cap sync`**, ATS, deep links (`MOBILE_SAFE_ROUTES`).

---

## 7. Related files

- `src/lib/routing/profile-access.ts`
- `src/app/(app)/curiosity/page.tsx`, `challenge/page.tsx`, `discover/category/page.tsx`, `progress/category/page.tsx`
- `src/app/(app)/profile/page.tsx` (router: query vs own hub)
- `src/components/social/public-profile-layout.tsx`
- `src/lib/constants/routes.ts` (`MOBILE_SAFE_ROUTES`)

See **`STAGE_3_MOBILE_ROUTING_PREP_SUMMARY.md`**.
