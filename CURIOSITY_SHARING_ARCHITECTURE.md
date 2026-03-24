# Curiosity Sharing Architecture

Phase 10.2 implements sharing of curiosity discoveries: copy link, native share sheet, and share cards.

---

## How Share Links Are Built

**Helper:** `getShareUrl(topicSlug)`

- Uses `NEXT_PUBLIC_APP_URL` when set (e.g. `https://yourdomain.com`)
- Falls back to `window.location.origin` on the client
- Falls back to `http://localhost:3005` in development when env is unset
- Produces: `{baseUrl}/curiosity/{slug}`

---

## How Share Text Is Derived

**Helper:** `getTopicShareMetadata(input)`

- **title:** `{topicTitle} | Kuriosa`
- **shareText:** "Today I learned {hook question}" or "Today I learned something curious: {title}"
- **description:** First 160 chars of hook, short summary, or title
- **shareUrl:** From `getShareUrl`

---

## Native Share vs Copy-Link

1. **If `navigator.share` exists:** Call it with title, text, url → channel `native_share`
2. **Else:** Copy `shareUrl` to clipboard via `navigator.clipboard.writeText` → channel `copy_link`
3. **On native share cancel (AbortError):** Show "Share cancelled"; no fallback to copy
4. **On clipboard failure:** Show error; sharing stops

---

## Share Event Recording

**Service:** `recordShareEvent` (server)  
**API:** `POST /api/social/record-share` (body: `topicId`, `channel`)

- Records `topic_shared` in `activity_events` when user is signed in
- Skipped when signed out (analytics only for authenticated shares)
- Fire-and-forget; failures do not affect sharing

---

## Where Share UI Appears

- **Header:** Compact Share button next to the curiosity header (desktop: right-aligned; mobile: below header)
- **What's next:** Share card in `#whats-next` with title, hook/snippet, Kuriosa branding, and Share button

---

## What 10.3 Will Add Next

- Profile page UI
- Activity feed UI
- Leaderboard UI
- Possible share refinements
