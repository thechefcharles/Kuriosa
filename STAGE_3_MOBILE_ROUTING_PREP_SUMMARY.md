# Stage 3 — Mobile routing & export prep (summary)

**Scope:** Additive query-param routes alongside existing dynamic segments; shared `PublicProfileLayout`; `profile-access` + middleware/guard alignment; `MOBILE_SAFE_ROUTES`; `next.config` documentation. **No** `output: 'export'` yet, **no** Capacitor iOS.

## Delivered

- **`/curiosity?slug=`**, **`/challenge?slug=`**, **`/discover/category?slug=`**, **`/progress/category?slug=`** — client shells reusing existing screens.
- **`/profile?userId=`** — public profile via same layout as **`/profile/[userId]`**; own hub stays **`/profile`** without query.
- **`MOBILE_SAFE_ROUTES`** + **`KURIOSA_MOBILE_ROUTING_AND_EXPORT_PREP.md`**.

## Suggested commit message

```
refactor(mobile): add mobile-safe routes and static export prep for Capacitor readiness
```

## Next (Stage 4)

Try `output: 'export'`, resolve Sentry/dynamic conflicts, CORS, Capacitor sync.
