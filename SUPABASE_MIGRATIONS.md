# Supabase Migrations

## How to Run Migrations

### Option A: Supabase CLI (recommended)

1. **Install Supabase CLI** (if needed):
   ```bash
   npm install -g supabase
   ```

2. **Log in**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```
   Get your project ref from Supabase Dashboard → Project Settings → General.

4. **Apply migrations**:
   ```bash
   supabase db push
   ```

### Option B: Supabase Dashboard

1. Open your project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor**
3. Run each migration file in order:
   - `supabase/migrations/20250307120000_create_core_schema.sql`
   - `supabase/migrations/20250307120001_seed_categories_and_badges.sql`
   - `supabase/migrations/20250307120002_create_profile_trigger.sql` (for auth)
   - `supabase/migrations/20250307130000_enable_rls.sql` (Phase 3.3)
   - `supabase/migrations/20250307130001_seed_reference_data.sql` (Phase 3.3)
   - `supabase/migrations/20250318120000_add_quiz_memory_recall_hints.sql` (Phase 4.9 — persistence)

### Verify

1. In Supabase Dashboard → **Table Editor**, confirm all 13 tables exist
2. Check that `categories` and `badges` have seed rows
3. Ensure `profiles` references `auth.users` (auth schema must exist)

## Generate TypeScript Types

After migrations are applied:

```bash
npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.ts
```

Replace `src/types/database.ts` with the generated output. The placeholder file documents this workflow.
