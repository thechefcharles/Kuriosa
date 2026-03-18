# Phase 4.10 Summary

## What this prompt implemented

- **Internal preview surface** for a persisted `CuriosityExperience` by `topics.slug`
  - `src/app/internal/content-preview/[slug]/page.tsx`
- **Preview loading helper**
  - `src/lib/services/content/load-curiosity-preview.ts`
  - Builds a `CuriosityExperience`-shaped object from normalized tables
- **Review workflow / publish-reject mechanics**
  - `src/lib/services/internal/curiosity-workflow.ts`
  - Guards: `reviewed`, `published`, `rejected`, `archived`
- **Safe tool authorization**
  - `src/lib/services/internal/internal-content-workflow-guard.ts`
  - Requires authenticated user + email allowlist
- **Internal API endpoints**
  - POST routes under `src/app/api/internal/content-preview/[slug]/...`
- **Review status type consistency**
  - Extended `CuriosityReviewStatus` + Zod enum to include `rejected`

## Foundation now exists

- A developer/editor can preview persisted content and move it through the status lifecycle.
- The implementation is intentionally minimal: it updates `topics.status` (and `topics.source_type`) without adding a full RBAC system.

## What remains in Phase 4

- Polished admin UI and review dashboards
- Stronger multi-editor workflow / per-user permissions
- Persisting moderation notes + safety flags if/when those columns exist in the schema
- Seed batch + preview flows for dozens of CuriosityExperiences

## Manual setup still required before moving to 4.11

1. Ensure content persistence worked in Phase 4.9 (you have `topics` rows).
2. Set `INTERNAL_CONTENT_WORKFLOW_ALLOWLIST_EMAILS` in `.env.local`.
3. Start the app (`npm run dev`) and open:
   - `/internal/content-preview/<topic-slug>`

