# Curiosity audio — Storage bucket, policies, and `topics.audio_url`

This guide explains **in detail** how to wire Supabase Storage so Listen Mode can play files from **`topics.audio_url`**.

---

## 1. Two ways the app gets a valid `audio_url`

The loader only turns on Listen Mode when **`audio_url`** is a non-empty **`http://` or `https://`** URL.

| Approach | When to use |
|----------|-------------|
| **A. Any HTTPS URL** | File is hosted elsewhere (CDN, S3, podcast host, etc.). You paste that URL into `topics.audio_url`. No Supabase Storage required. |
| **B. Upload to Supabase Storage** | You want files in your Supabase project. You upload to bucket **`curiosity-audio`** (or your custom bucket name), then save the **public URL** Supabase gives you into **`topics.audio_url`**. |

Both end the same way: **`topics.audio_url`** must equal the exact URL the browser can `GET` (usually **https**).

---

## 2. Bucket name: default vs env

- **Default bucket id:** `curiosity-audio`  
  Used by `uploadCuriosityAudio`, `getAudioPublicUrl`, and `getCuriosityAudioBucketName()` when env is unset.

- **Override:** set **`NEXT_PUBLIC_SUPABASE_AUDIO_BUCKET=my-bucket-name`** in `.env.local` (and production env).  
  Then create a bucket with **that** id in Supabase. The app and your SQL policies must use the **same** name.

**Important:** After changing the env var, restart the Next.js dev server so client code picks up the new public bucket name.

---

## 3. Create the bucket (Supabase Dashboard)

1. Open your project → **Storage**.
2. **New bucket**.
3. **Name:** `curiosity-audio` (or match `NEXT_PUBLIC_SUPABASE_AUDIO_BUCKET`).
4. **Public bucket:**  
   - **Public = ON** is the simplest path for Phase 8.1: objects get a stable **public URL** that matches what `getPublicUrl()` returns and what `<audio src="...">` needs.  
   - **Public = OFF** means URLs are not directly playable without **signed URLs** (extra app work — not assumed in current player code).

5. Create.

**File layout in the bucket** (what the code expects):

- Path: **`audio/{topicId-or-slug}.{ext}`**  
  Example: `audio/550e8400-e29b-41d4-a716-446655440000.mp3` or `audio/why-octopuses-have-three-hearts.mp3`.

---

## 4. Storage policies (RLS on `storage.objects`)

Supabase enforces **policies** on who can **read**, **insert**, **update**, **delete** objects.

**Service role** (`SUPABASE_SERVICE_ROLE_KEY`) **bypasses** RLS. So a **server-only** API route that uses the service client can upload **without** an INSERT policy — useful for admin tools.

**Anon / authenticated** browsers use the **anon** or **session** key → policies **do** apply.

### 4a. Public **read** (so anyone can stream audio)

If the bucket is **public**, reads are often already allowed; if not, add:

```sql
-- Allow anyone to read objects in this bucket (streaming in the app)
CREATE POLICY "curiosity_audio_public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'curiosity-audio');
```

If you use a custom bucket name, replace `'curiosity-audio'` everywhere below.

### 4b. Who can **upload**?

Pick one model (or combine).

**Model 1 — Server-only uploads (recommended for CMS)**  
- No INSERT policy for `anon` / `authenticated`.  
- Admin script or API route uses **`createClient(url, SERVICE_ROLE_KEY)`** and calls `uploadCuriosityAudio(supabase, { file, topicId })`.  
- Only your backend can write; no secret on the client.

**Model 2 — Logged-in users may upload** (e.g. future creator flow)

```sql
CREATE POLICY "curiosity_audio_authenticated_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'curiosity-audio');

-- Optional: restrict to a folder prefix
-- WITH CHECK (bucket_id = 'curiosity-audio' AND (storage.foldername(name))[1] = 'audio');
```

**Model 3 — Open upload (NOT for production)**  
Allowing `anon` INSERT is dangerous (abuse, cost). Avoid unless it’s a locked-down dev project.

### 4c. **Update / delete** (replace files)

If you use `upsert: true` in code, uploads may need **UPDATE** as well:

```sql
CREATE POLICY "curiosity_audio_authenticated_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'curiosity-audio')
WITH CHECK (bucket_id = 'curiosity-audio');
```

(Service-role uploads still bypass these.)

Run policies in **SQL Editor** after the bucket exists. If a policy already exists with the same name, drop it first or use a new name.

---

## 5. After upload: set `topics.audio_url`

`uploadCuriosityAudio` returns:

- **`publicUrl`** — e.g. `https://<project>.supabase.co/storage/v1/object/public/curiosity-audio/audio/<id>.mp3`  
- **`storagePath`** — e.g. `audio/<id>.mp3`

**You must persist `publicUrl` on the topic row:**

```sql
UPDATE topics
SET audio_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/curiosity-audio/audio/YOUR_TOPIC_ID.mp3'
WHERE id = 'YOUR_TOPIC_ID';
```

Or in Supabase **Table Editor** → `topics` → set **`audio_url`** to that full string.

Optional: set **`audio_duration_seconds`** (integer seconds) and **`audio_script`** (transcript) for better UX.

---

## 6. Using `uploadCuriosityAudio` in code (conceptual)

```ts
import { createClient } from "@supabase/supabase-js";
import { uploadCuriosityAudio } from "@/lib/services/audio/upload-audio";

// Server-only: service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const file = ...; // Blob or File from FormData
const result = await uploadCuriosityAudio(supabase, {
  file,
  topicId: row.id, // UUID from topics.id
});

if (result.ok) {
  // Save result.publicUrl to topics.audio_url (update row)
} else {
  console.error(result.error);
}
```

Do **not** expose the service role key to the browser. For user-initiated uploads from the client, use the **authenticated** Supabase client plus **INSERT** policies scoped to that user or role.

---

## 7. Quick checklist

| Step | Done? |
|------|--------|
| Bucket `curiosity-audio` exists (or env + matching bucket) | |
| Bucket public **or** SELECT policy for anon/authenticated | |
| Upload path: either service-role script/API or INSERT policy for trusted users | |
| `topics.audio_url` = full **https** URL to the file | |
| App env matches bucket name if customized | |

---

## 8. Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Upload fails with RLS | Using anon/auth client without INSERT policy; use service role server-side or add policy. |
| Player 403 / empty | Bucket private and URL not signed; make bucket public or use public read policy. |
| Listen Mode still off | `audio_url` empty, wrong scheme, or typo — loader requires **http/https**. |
| Wrong file plays | `audio_url` points to another object; verify path and topic id. |

See also **`AUDIO_SYSTEM_ARCHITECTURE.md`** for how the loader uses **`audio_url`**.
