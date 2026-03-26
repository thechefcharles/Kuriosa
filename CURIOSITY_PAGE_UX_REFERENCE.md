# Curiosity Page UX Reference

Use this document as context for ChatGPT or design tools to understand and improve the curiosity experience flow. It describes `/curiosity/[slug]` (e.g. `/curiosity/honey-lasts-forever`) and the related challenge flow.

---

## 1. Route Structure

| Route | Purpose |
|-------|---------|
| `/curiosity/[slug]` | Main curiosity page — lesson, challenge CTA, what's next |
| `/challenge/[slug]` | Challenge page — one quiz question (main) + optional bonus question |

**Example:** `http://localhost:3005/curiosity/honey-lasts-forever`

---

## 2. Page Layout (App Shell)

All curiosity and challenge pages sit inside the app shell:
- **Top bar:** App branding / nav
- **Main content:** Scrollable body
- **Bottom nav:** Fixed — Home, Discover, Community, Progress, Profile (5 tabs)

---

## 3. Curiosity Page: `/curiosity/[slug]`

### 3.1 Content Order (Top → Bottom)

1. **Header**
   - Category badge (e.g. "Science")
   - Difficulty pill (e.g. "Intermediate")
   - Title (e.g. "Why honey lasts forever")
   - Estimated time (e.g. "About 5 mins")
   - Hook block: "Hook: [question that grabs attention]"

2. **Share button**
   - "Share" — opens native share or copies link
   - Shows "Shared!" or "Link copied!" feedback

3. **Mode toggle**
   - "Read" | "Listen" (if audio available)
   - "Same story — pick how you take it in"
   - If no audio: Listen is disabled with "Read works great · audio optional"

4. **Audio panel** (when Listen mode)
   - "Listen mode" header
   - Play button + progress
   - Transcript collapsible
   - Audio-complete callout when playback ends
   - (When Read mode: audio panel is off-screen but mounted so playback can continue)

5. **Lesson content**
   - Written lesson (paragraphs)
   - Optional "Surprising fact" block
   - Optional "Why it matters" block

6. **Next step callout**
   - "Next" eyebrow
   - "Ready for the challenge?"
   - "One quick question to lock in what you read."
   - **Button: "Take the challenge"** → links to `/challenge/[slug]`

7. **Section: What's next** (`id="whats-next"`, scroll target)
   - **Completion celebration card** (only after challenge completion — see flow below)
   - **Share topic card** (invite to share)
   - **Post-challenge exploration**
     - "What's next?" header
     - "One clear path forward — or dig deeper if you like."
     - Primary: first trail card or Discover
     - Secondary: second trail or "Browse more"
     - "Go deeper" collapsible: followups, AI block, extra trails
     - Dry state (no trails): "Ready for the next rabbit hole" + Discover + Surprise me + collapsed AI

---

## 4. Challenge Page: `/challenge/[slug]`

### 4.1 Content Order

1. **Back link**
   - "Back to lesson" → `/curiosity/[slug]`

2. **Header**
   - Topic title
   - "Quick challenge" (or "Bonus question" when on bonus)
   - "One question — see how much stuck." (or bonus copy)

3. **Challenge card**
   - Question text
   - Answer options (multiple choice) or textarea (recall)
   - "Check answer" button

4. **After submit: feedback block**
   - Correct: green — "Nice — you've got it." + optional "Earn XP when you see what's next"
   - Wrong: amber — "Not quite — here's the idea." + correct answer + explanation + "From the lesson" snippet

5. **Actions after feedback**
   - **If wrong:** "Try again" button (resets question) + "See what's next" button
   - **If correct (no bonus):** "See what's next" button only
   - **If correct + bonus exists:** "Want a quick bonus question?" offer
     - "Try bonus" → shows bonus question
     - "See what's next" → completes without bonus

6. **"See what's next" button**
   - Records completion via `POST /api/progress/complete-curiosity`
   - On success: stashes celebration payload, **redirects to `/curiosity/[slug]#whats-next`**
   - User lands back on the curiosity page, scrolled to the "What's next" section

---

## 5. Completion Flow (Critical Path)

1. User is on `/curiosity/honey-lasts-forever`
2. User taps **"Take the challenge"** → navigates to `/challenge/honey-lasts-forever`
3. User answers question → taps "Check answer"
4. Feedback appears (correct or wrong)
5. If wrong: user can "Try again" or "See what's next"
6. User taps **"See what's next"**
7. Client calls API to record completion (XP, streak, badges, etc.)
8. On success: celebration payload stashed in sessionStorage, `router.push(/curiosity/honey-lasts-forever#whats-next)`
9. User lands on `/curiosity/honey-lasts-forever` with hash `#whats-next`
10. Page scrolls to `#whats-next` (scroll-mt-24)
11. **CompletionCelebrationHost** consumes stashed payload for this slug
12. **CompletionCelebrationCard** appears: XP earned, level, streak, badges, "Got it" button
13. Below: Share card, Post-challenge exploration (trails, followups, AI, Discover)

---

## 6. Buttons and CTAs

| Location | Label | Action / Route |
|----------|-------|----------------|
| Curiosity page | Share | Share or copy link |
| Curiosity page | Take the challenge | → `/challenge/[slug]` |
| Challenge page | Back to lesson | → `/curiosity/[slug]` |
| Challenge page | Check answer | Submit answer, show feedback |
| Challenge page | Try again | Reset question (wrong answer) |
| Challenge page | Try bonus | Show bonus question |
| Challenge page | See what's next | Record completion, redirect to `/curiosity/[slug]#whats-next` |
| Post-challenge | Trail card | → `/curiosity/[trail-slug]` |
| Post-challenge | Browse more / Browse Discover | → `/discover` |
| Post-challenge | Discover | → `/discover` |
| Post-challenge | Surprise me | → `/home` |
| Celebration card | Got it | Dismiss celebration |

---

## 7. Session/Context Tracking

- **session-topic-discovery:** Tracks `wasDailyFeature` and `wasRandomSpin` for the current topic (set when entering from Home daily or random)
- **session-curiosity-modes:** Tracks read/listen/read_listen for completion API
- **completion-celebration-storage:** SessionStorage, ~15 min TTL, consumed once when landing on curiosity page with matching slug
- **session-completion-tracker:** Counts completions this session (for "You're on a roll" arc)

---

## 8. Possible UX Pain Points to Improve

1. **Challenge → Curiosity redirect:** User leaves curiosity page, does challenge on separate page, then returns. Could feel disjointed. Alternatives: in-page challenge, modal, or clearer "you're coming back" framing.

2. **Scroll target:** `#whats-next` scrolls to section, but completion card appears inside it. On slow networks, card might render after scroll — could feel jumpy.

3. **"What's next" when pre-challenge:** The section is always visible (trails, share, etc.) even before the user takes the challenge. Some users might scroll down before challenging — is that desired?

4. **Bonus offer placement:** When correct, bonus offer appears; "See what's next" is alongside. Could feel like two competing CTAs.

5. **Trail vs Discover hierarchy:** Primary = first trail, secondary = second trail or Browse more. "Go deeper" is collapsed. Could the primary action be clearer?

6. **Mode toggle prominence:** Read/Listen lives near the top. Users who prefer listen might want it more prominent.

7. **Completion celebration:** One-shot, dismissible. No "view full progress" link from there — user would use bottom nav.

8. **Error states:** If "See what's next" API fails, user sees "Couldn't save this time" but still navigates. They land on curiosity page without celebration.

---

## 9. Technical Files for Implementation

| Area | Files |
|------|-------|
| Curiosity page | `src/app/(app)/curiosity/[slug]/page.tsx`, `curiosity-experience-screen.tsx` |
| Challenge page | `src/app/(app)/challenge/[slug]/page.tsx`, `challenge-screen.tsx` |
| Completion | `challenge-continue-exploring-button.tsx`, `completion-celebration-host.tsx`, `completion-celebration-card.tsx` |
| Post-challenge | `post-challenge-exploration.tsx`, `trail-card.tsx`, `followup-section.tsx` |
| Routes | `src/lib/constants/routes.ts` |
| Session tracking | `session-topic-discovery.ts`, `session-curiosity-modes.ts` |

---

## 10. Prompt Template for ChatGPT

Use this when asking for UX improvements:

```
I'm working on a curiosity/learning app. The curiosity page flow is:

1. User reads/listens to a lesson at /curiosity/[slug]
2. User taps "Take the challenge" → goes to /challenge/[slug]
3. User answers one quiz question (with optional retry or bonus)
4. User taps "See what's next" → API records completion → redirects back to /curiosity/[slug]#whats-next
5. User sees completion celebration (XP, badges) + "What's next" (trails, Discover, AI)

The full flow is documented in CURIOSITY_PAGE_UX_REFERENCE.md. Key sections: route structure, content order, buttons, completion flow, and potential pain points.

Please suggest improvements to: [specific area, e.g. challenge-to-curiosity transition, bonus offer placement, "what's next" hierarchy]
```
