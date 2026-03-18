# Discovery: search, recent topics, and suggestions

Beginner-friendly overview of how **Discover** finds topics after **Phase 7.4**.

## Search

- There is a **search box** at the top of `/discover`.
- You need **at least two characters** (after trimming spaces). One letter is ignored on purpose so we don’t run huge queries for every keystroke.
- Search runs only on **published** topics.
- It looks for your text in:
  - **Topic title** (partial match, case-insensitive)
  - **Hook text** (same kind of match)
  - **Tags** (`topic_tags.tag`)
  - **Category name and slug**
- Results are merged in a **fixed order**: title matches first, then hook, then tag matches, then category matches. There is **no fancy ranking** or typo correction.
- At most **20** topics are returned.
- Clearing the search brings back the normal page (categories, featured, etc.) as the main focus.

**Intentionally simple for now:** no fuzzy search, no vectors, no AI.

## Suggested topics (“More to explore”)

This is **not** machine learning and **not** “because we tracked you across the web.”

- **If you’re signed in** and you’ve **finished at least one curiosity** (same history as “Recently explored”):
  - We look at the **categories** of those finished topics.
  - We suggest **other published topics in those categories** (newest-updated first), **excluding** topics you’ve already finished recently.
  - We add **one topic from a different category** when possible, so the list isn’t only “more of the same lane.”
  - If that’s still thin, we **fill the list** from the same **featured** pool used elsewhere, still avoiding your recent finishes.
- **If you’re signed out** or have **no finishes yet:**
  - We show a small set from **featured topics** (same source as “Jump in here”), up to **8** cards.

**Intentionally simple:** no scores, no A/B tests, no personalization engine.

## Recently explored

- **Signed in:** lists curiosities you **completed** (rewarded completions in `user_topic_history`), most recent first. Tap to reopen that topic.
- **Signed out:** we show a short note and a link to **sign in** so you know why the list is empty — it’s not broken.

## What Phase 7.5 will polish next

- Possible **deduping** between “Jump in here” and “More to explore.”
- **Debounce** or tuning for search (if needed).
- **Copy and layout** tweaks, empty states, and maybe **query key invalidation** when you finish a topic so suggestions refresh naturally.

No new recommendation engine is required for 7.5 unless the spec says otherwise.
