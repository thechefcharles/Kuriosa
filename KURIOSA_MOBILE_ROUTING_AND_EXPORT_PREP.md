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

## 5. Export readiness (honest status)

**`output: 'export'` is still not enabled.** Remaining blockers include:

- All **`src/app/api/**`** route handlers (must stay hosted).
- **Middleware** (no-op in Capacitor; client guard + `fetchApi` already mitigate).
- **`generateMetadata`** on **`curiosity/[slug]`** (and any other server-only pages you add).
- **Sentry** `withSentryConfig` — validate when flipping export.
- **Cross-origin cookies** for `fetchApi` (Stage 4+ / CORS).

Stage 3 **reduces** the **routing** / **infinite prerender** problem; it does **not** complete packaging.

---

## 6. Stage 4 (suggested next)

- Enable **`output: 'export'`** in a branch; fix build errors.
- CORS / session for **`NEXT_PUBLIC_API_ORIGIN`** if needed.
- Capacitor **`webDir: 'out'`**, `npx cap add ios`, device testing.

---

## 7. Related files

- `src/lib/routing/profile-access.ts`
- `src/app/(app)/curiosity/page.tsx`, `challenge/page.tsx`, `discover/category/page.tsx`, `progress/category/page.tsx`
- `src/app/(app)/profile/page.tsx` (router: query vs own hub)
- `src/components/social/public-profile-layout.tsx`
- `src/lib/constants/routes.ts` (`MOBILE_SAFE_ROUTES`)

See **`STAGE_3_MOBILE_ROUTING_PREP_SUMMARY.md`**.
