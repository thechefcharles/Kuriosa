# Post-challenge exploration architecture

## Purpose

After a user finishes the **challenge** (`/challenge/[slug]`), **Continue** sends them to:

- **`/curiosity/[slug]#whats-next`**

That anchor sits in a **post-challenge exploration** block on the **same curiosity page** (no new route). It answers: *“What else can I explore?”*

## Page layout (curiosity)

Order on `/curiosity/[slug]`:

1. Header, Read/Listen, lesson content  
2. **Next step** → **Take the challenge** (entry into the quiz)  
3. **`#whats-next`** → **Post-challenge exploration** (follow-ups + trails)

So: lesson → challenge → (after challenge) follow-ups and trails.

## Components

| Component | Role |
|-----------|------|
| **`PostChallengeExploration`** | Wrapper: intro copy, two subsections. |
| **`FollowupSection`** | Up to **5** follow-ups; empty fallback if none. |
| **`FollowupCard`** | Tap question to expand/collapse **answer**. |
| **`FollowupAnswer`** | Answer snippet when expanded. |
| **`TrailSection`** | Sorted trails; empty fallback if none. |
| **`TrailCard`** | Link to **`/curiosity/[next-slug]`** with teaser text. |

## Data

Everything comes from **`LoadedCuriosityExperience`** already loaded on the page:

- **`experience.followups`**
- **`experience.trails`**

No extra Supabase queries.

## Follow-up interaction

- One follow-up **open at a time** (simple toggle).
- **Accessible**: `aria-expanded`, `aria-controls` on the question button.

## Trail navigation

Each trail is a **card link** to the **related topic slug**. No recommendation engine—just persisted trail rows.

## Challenge handoff

**`ChallengeFeedback`** → **Continue** → `#whats-next` lands users on **follow-ups first**, then **trails**.

## Not built yet (5.8+)

Typical next phase items (confirm in your roadmap):

- **XP / progress / completion** persistence  
- **Manual “ask AI”** follow-ups  
- **Personalized** trail ordering  

See **`PHASE_5_7_SUMMARY.md`** for this prompt’s scope.
