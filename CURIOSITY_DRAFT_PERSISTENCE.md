# CuriosityExperience draft persistence (Phase 4.9)

## What it does

**`persistCuriosityExperienceDraft(experience)`** writes a **validated** canonical **`CuriosityExperience`** into Supabase:

| Table | Action |
|-------|--------|
| **topics** | Upsert on **`slug`** (insert or update) |
| **topic_tags** | Delete all for topic, then insert (replace) |
| **topic_followups** | Delete all for topic, then insert |
| **quizzes** | Delete all for topic, insert primary challenge |
| **quiz_options** | Insert for that quiz |
| **topic_trails** | Delete outgoing trails, insert rows where **`to_topic_id`** resolves |

## Requirements

1. **`SUPABASE_SERVICE_ROLE_KEY`** in **`.env.local`** (Settings → API → service_role). **Server-only** — never ship to the browser.
2. **Migration** `supabase/migrations/20250318120000_add_quiz_memory_recall_hints.sql` applied (adds **`memory_recall_hints`** on **`quizzes`** for **`memory_recall`**).
3. **Categories** seeded (e.g. **science**) so **`categorySlug`** / name resolve.

## Category lookup

1. Match **`taxonomy.categorySlug`** to **`categories.slug`**.
2. Else **`ILIKE`** on **`categories.name`** with **`taxonomy.category`**.

If neither matches → persistence returns an error (no topic row).

## Trails (unresolved)

**`topic_trails`** requires a real **`to_topic_id`**. Targets are looked up by **`toTopicSlug`** on **`topics`**.

- If the slug **does not exist** → trail is **skipped** and listed in **`unresolvedTrails`** + **`warnings`**.
- To attach trails, **persist the destination topic first** (same slug as the trail), then re-persist the source topic.

No staging table — avoids schema churn.

## Upsert / re-persist

- **Same slug** → **updates** the topic row and **replaces** tags, followups, quiz (+ options), and **outgoing** trails.
- **Idempotent** for repeated runs of the same draft.

## Memory recall quizzes

- **`quiz_type`** = **`memory_recall`**.
- Accepted answers JSON → **`quizzes.memory_recall_hints`** (array of strings).
- **`quiz_options`** still stores the canonical options (e.g. single correct line from assembly).

## Moderation / source

- **`topics.status`** ← **`moderation.reviewStatus`** (`published` / `archived` / `reviewed` / default **`draft`**).
- **`topics.source_type`** ← **`analytics.sourceType`**.

## Run the example

```bash
npm run persist:draft
```

Inspect **topics**, **topic_tags**, **topic_followups**, **quizzes**, **quiz_options** in the Supabase dashboard.

## Still to build (later)

Admin publish/reject UI, batch seeding, preview APIs — persistence is ready for those flows.
