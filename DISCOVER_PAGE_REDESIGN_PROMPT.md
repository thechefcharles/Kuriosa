# Discover Page Redesign Prompt

Use this prompt with an AI assistant (e.g. ChatGPT, Cursor) to redesign the Discover page using the same philosophy as the Home page: **one dominant action, one next best action, one escape hatch** — less "a page with sections," more "tap-first" mobile-app feel.

---

## Current state (what to change)

The Discover page reads like a long scrolling catalog:

- Large centered header: "Explore" badge, "Discover" gradient title, "Search, browse by category, or jump in"
- Search bar (full-width, prominent)
- Section: "Browse by category" / "Pick a lane" — grid of category cards
- Section: "Jump in" / "Hand-picked curiosities" — topic cards grid
- Section: "Recently explored" — list of completed topics (when signed in)
- Section: "More to explore" / "More from the catalog" — suggested topic cards
- Section: "Surprise me" — bordered card with FeedMyCuriosityButton

Everything has similar visual weight. The page feels like a reading list, not an app screen.

---

## Recommended Discover redesign

### Overall structure

Keep the sticky top bar and bottom nav. Simplify the body into three stacked zones:

1. **Compact header** — eyebrow + one line
2. **Hero: search + jump-in** — primary browse experience
3. **Secondary strip** — categories + escape hatches (Recent, Surprise me)

---

## 1. Header: make it much smaller

**Current issue**

The centered "Explore / Discover / Search, browse by category…" block consumes too much vertical space before the user can do anything.

**Better version**

Replace with a compact intro:

- **Eyebrow:** Browse
- **Main line:** Find something to explore

Or even tighter:

- **Browse**
- **Search or pick a curiosity**

**Why**

Instantly makes the screen feel like an app, not a landing page.

---

## 2. Hero: Search + Jump in as the dominant zone

The primary action on Discover is **finding and starting a curiosity**. Two entry points matter most:

- **Search** — for users who know what they want
- **Jump in (featured topics)** — for users who want to browse

**Card hierarchy**

Combine these into one hero zone:

1. **Compact search bar** — always visible at top of hero
2. **"Jump in" label** — small, not a full section header
3. **Featured topic cards** — 2 columns on mobile, 3 on larger screens
4. **Limit to 4–6 cards** — don’t overfill; "More" can live in category views

**Search treatment**

- Shorter placeholder: "Search topics…" or "What are you curious about?"
- Remove helper: "Type at least two characters…" — only show it inline when typing (e.g. "2+ characters")
- Search results: replace the long section header with a minimal "Results for X" and the grid

**Jump in copy**

- **Current:** "Jump in" / "Hand-picked curiosities"
- **Replace with:** "Jump in" / "Curated picks" or just "Jump in" with no subcopy

---

## 3. Secondary: Categories strip

Categories are the next best action — browse by lane.

**Current:** Full section with "Browse by category" / "Pick a lane"

**Better treatment**

- **Label:** Browse by category
- **Layout:** Horizontal scroll or compact 2x2 grid (4 categories visible, scroll for more)
- **Reduce:** Remove "Pick a lane" — the label is enough
- **Visual weight:** Lighter than the hero. Use `rounded-2xl border bg-background/70 p-4` style, similar to the home "Prefer a surprise?" block

---

## 4. Tertiary: Recent + Surprise me + More to explore

De-emphasize these. They are escape hatches, not primary actions.

**Recently explored**

- **Current:** Full section with "Curiosities you've finished — jump back in anytime"
- **Better:** Compact row or collapsible. Label: "Recent" or "Pick up where you left off"
- **Signed-out:** Keep the sign-in prompt but make it one small bordered block, not a full section

**More to explore (suggested)**

- **Current:** Full section "More from the catalog"
- **Better:** Show only when there are suggestions and no search active. Label: "More picks" — no long description
- **Placement:** Below Recent, or fold into a "See more" expansion

**Surprise me**

- **Current:** Bordered card with icon, "Let the app pick one for you," full FeedMyCuriosityButton
- **Better:** Same treatment as home — compact strip:
  - Label: "Prefer a surprise?"
  - Difficulty pills + "Feed my curiosity" button
- **Copy:** Remove "Let the app pick one for you" — the button says it

---

## 5. Best hierarchy

| Priority | Element                    | Treatment                                      |
|----------|----------------------------|------------------------------------------------|
| Primary  | Search + Jump in (featured)| Hero zone, most vertical space, clearest CTA   |
| Secondary| Categories                 | Compact strip, lighter visual weight           |
| Tertiary | Recent                     | Small row or block                             |
| Tertiary | More to explore            | Conditional, minimal                           |
| Tertiary | Surprise me                | Same as home — compact strip                   |

---

## 6. Reduce text across the page

**Header**

- Current: "Search, browse by category, or jump in"
- Replace with: "Search or pick a curiosity" or "Find something to explore"

**Jump in**

- Current: "Hand-picked curiosities"
- Replace with: (remove) or "Curated picks"

**Categories**

- Current: "Pick a lane"
- Replace with: (remove)

**Recent**

- Current: "Curiosities you've finished — jump back in anytime"
- Replace with: "Pick up where you left off" or "Recent"

**Surprise me**

- Current: "Let the app pick one for you"
- Replace with: (remove — button is clear)

**Search results**

- Current: "Matches for "X" in titles, tags, and categories."
- Replace with: "Results for X" or just show the grid

---

## 7. Layout and styling (mobile-first)

**Container**

- `max-w-md` or `max-w-lg` for mobile feel on desktop
- `px-4` padding, `space-y-4` or `space-y-5` between zones

**Spacing**

- Top bar → 16–20px → compact header
- Header → 12–16px → search bar
- Search → 16px → Jump in grid
- Jump in → 16px → Categories strip
- Categories → 12px → Recent
- Recent → 12px → More to explore (if shown)
- More → 12px → Surprise me strip

**Typography**

- Eyebrow: `text-xs font-semibold uppercase tracking-wider text-muted-foreground`
- Main header: `text-xl font-semibold tracking-tight`
- Section labels: `text-sm font-medium` — not full section headers
- Reduce gradient text; use sparingly

**Hero zone**

- Search: `rounded-xl`, `h-11`, full width
- Jump in grid: `grid-cols-2` on mobile, `gap-3` or `gap-4`
- Topic cards: keep existing `TopicCard` but ensure they’re not dwarfed by section chrome

---

## 8. Proposed wireframe

```
[Top bar]

Browse
Find something to explore

┌─────────────────────────────────────┐
│ [🔍 Search topics…            ]     │
└─────────────────────────────────────┘

Jump in

┌──────────────┐ ┌──────────────┐
│ Topic card   │ │ Topic card   │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ Topic card   │ │ Topic card   │
└──────────────┘ └──────────────┘

Browse by category

┌────┐ ┌────┐ ┌────┐ ┌────┐
│Cat1│ │Cat2│ │Cat3│ │Cat4│  (horizontal scroll or 2x2)
└────┘ └────┘ └────┘ └────┘

Recent
┌─────────────────────────────────────┐
│ History  Topic title     Jan 12     │
└─────────────────────────────────────┘

Prefer a surprise?
[ All ] [ Beginner ] [ Intermediate ] [ Advanced ]
[ Feed my curiosity ]

[Bottom nav]
```

---

## 9. React/Tailwind implementation direction

**Structure**

- `DiscoverScreen`
- `DiscoverHeaderCompact` — eyebrow + one line
- `DiscoverSearchHero` — search input + Jump in grid (when !searchActive)
- `DiscoverSearchResults` — when searchActive, replace Jump in with results
- `DiscoverCategoriesStrip` — horizontal or compact grid
- `DiscoverRecentStrip` — compact, conditional on auth
- `DiscoverMoreStrip` — optional, when suggested exists
- `DiscoverRandomStrip` — same as home (`FeedMyCuriosityButton` with `compact`)

**Key files to edit**

- `src/components/discovery/discover-screen.tsx` — main layout
- `src/components/discovery/discovery-section-header.tsx` — simplify or bypass for compact labels
- `src/components/discovery/topic-card.tsx` — keep, possibly tighten
- `src/components/discovery/category-card.tsx` — keep, used in strip
- `PageContainer` — use `max-w-md` on discover route

**Search state**

- When `searchActive`: hide Jump in grid, show search results in same hero zone
- Smooth transition; avoid layout jump if possible

---

## 10. If you change only three things

1. **Shrink the header** — "Browse" / "Find something to explore" instead of the big gradient block
2. **Make Search + Jump in the hero** — one cohesive zone, minimal section chrome
3. **Compress Categories, Recent, Surprise me** — lighter strips, not full sections

That will make Discover feel more premium, more mobile-native, and more guided — aligned with the home redesign.
