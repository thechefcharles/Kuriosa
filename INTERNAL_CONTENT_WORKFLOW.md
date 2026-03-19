# Internal content workflow (Phase 4.10)

This internal workflow lets a developer/editor inspect and move an AI-generated CuriosityExperience through a basic lifecycle *before* we build the polished admin UI.

## What it does

1. **Preview** an assembled/persisted topic by `slug`
2. **Mark review status** by updating `topics.status` in Supabase:
   - `draft`
   - `reviewed`
   - `published`
   - `rejected`
   - `archived`

No public UI is built and no new content is generated in this phase.

## Key files

- `src/lib/services/content/load-curiosity-preview.ts`
  - Loads `topics` + related rows (tags, followups, quizzes/options, trails)
  - Builds a `CuriosityExperience`-shaped preview object (with safe defaults for fields not persisted yet, like rewards)
- `src/lib/services/internal/curiosity-workflow.ts`
  - Implements status transitions (`reviewed`, `published`, `rejected`, `archived`)
- `src/lib/services/internal/internal-content-workflow-guard.ts`
  - Protects internal tools using auth + an email allowlist
- Internal surface:
  - `src/app/internal/content-preview/[slug]/page.tsx`
  - POST endpoints under `src/app/api/internal/content-preview/[slug]/*`

## Internal safeguards (important)

Internal routes/tools require:

- the user to be **authenticated** (Supabase session cookie)
- the user’s email to be included in `INTERNAL_CONTENT_WORKFLOW_ALLOWLIST_EMAILS`

If `INTERNAL_CONTENT_WORKFLOW_ALLOWLIST_EMAILS` is not configured, internal actions are disabled (fail closed).

## How slug-based preview works

- The preview page loads by `topics.slug`
- Trails show `topic_trails` where `from_topic_id = topics.id`
- Destinations are resolved by looking up `topics` for `to_topic_id`

## Runbook (what to do next)

1. Apply/persist content first (Phase 4.9): `npm run persist:draft`
2. Open the internal preview page:
   - `/internal/content-preview/<topic-slug>`
3. Use the buttons on the page to transition:
   - Mark Reviewed → Publish / Reject / Archive
4. Verify changes in Supabase → Table Editor → `topics.status`

## What’s missing before full admin tooling (Phase 4.11+)

- A polished editor UI
- Real multi-editor workflow / roles
- Persisting moderation notes + safety flags into the DB
- Seeding batches and more robust “trail target resolution” behavior

