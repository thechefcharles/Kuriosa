/**
 * Lightweight deterministic “suggested next” topics — not ML, not personalization.
 *
 * Logic:
 * 1. **Signed-in with recent completions** (same source as “Pick up where you left off”):
 *    - Remember slugs to **exclude** (already finished recently).
 *    - **Categories** of those topics → load other **published** topics in those categories
 *      (newest `updated_at` first), excluding those slugs, up to **7**.
 *    - Prepend **one wildcard**: a published topic from a **different** category (if any),
 *      so the strip isn’t only “more of the same lane.”
 * 2. **Pad to 8** if needed: fill from **`getFeaturedTopics`** order, excluding recent slugs
 *    and duplicates.
 * 3. **Guest or no recent history:** first **8** from **`getFeaturedTopics`** (deterministic).
 *
 * Phase 7.5 can refine overlap with “Jump in here” and refresh behavior.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { TopicCardView } from "@/types/discovery";
import { mapTopicToTopicCardView } from "@/lib/services/discovery/read/discovery-read-helpers";
import { getRecentTopics } from "@/lib/services/discovery/get-recent-topics";
import { getFeaturedTopics } from "@/lib/services/discovery/get-featured-topics";

const CAP = 8;
const SAME_CATEGORY_MAX = 7;

type TopicRow = {
  id: string;
  slug: string;
  title: string;
  hook_text?: string | null;
  difficulty_level?: string | null;
  estimated_minutes?: number | null;
  category_id: string;
};

async function loadCategoryMap(
  supabase: SupabaseClient,
  categoryIds: string[]
): Promise<Map<string, { slug: string; name: string }>> {
  const map = new Map<string, { slug: string; name: string }>();
  if (!categoryIds.length) return map;
  const { data: cats } = await supabase
    .from("categories")
    .select("id, slug, name")
    .in("id", categoryIds);
  for (const c of cats ?? []) {
    const row = c as { id: string; slug: string; name: string };
    map.set(String(row.id), { slug: String(row.slug), name: String(row.name) });
  }
  return map;
}

async function rowsToCards(
  supabase: SupabaseClient,
  rows: TopicRow[]
): Promise<TopicCardView[]> {
  const catIds = [...new Set(rows.map((r) => String(r.category_id)))];
  const catMap = await loadCategoryMap(supabase, catIds);
  const out: TopicCardView[] = [];
  for (const row of rows) {
    const c = catMap.get(String(row.category_id));
    const v = mapTopicToTopicCardView(row, {
      categoryName: c?.name,
      categorySlug: c?.slug,
    });
    if (v) out.push(v);
  }
  return out;
}

function rowFromFeaturedList(
  featuredCards: TopicCardView[],
  rowsBySlug: Map<string, TopicRow>,
  exclude: Set<string>,
  seen: Set<string>,
  max: number
): TopicRow[] {
  const out: TopicRow[] = [];
  for (const f of featuredCards) {
    if (out.length >= max) break;
    if (exclude.has(f.slug)) continue;
    const r = rowsBySlug.get(f.slug);
    if (!r || seen.has(r.id)) continue;
    seen.add(r.id);
    out.push(r);
  }
  return out;
}

export async function getSuggestedTopics(
  supabase: SupabaseClient,
  userId: string | null
): Promise<TopicCardView[]> {
  const excludeSlugs = new Set<string>();
  let categoryIdsFromRecent: string[] = [];

  const uid = userId?.trim() ?? "";
  if (uid) {
    const recent = await getRecentTopics(supabase, uid);
    for (const r of recent) excludeSlugs.add(r.slug);
    if (recent.length) {
      const { data: tops } = await supabase
        .from("topics")
        .select("category_id")
        .in("id", recent.map((r) => r.id));
      categoryIdsFromRecent = [
        ...new Set(
          (tops ?? []).map((t) => String((t as { category_id: string }).category_id))
        ),
      ];
    }
  }

  const seenIds = new Set<string>();
  const ordered: TopicRow[] = [];

  const push = (r: TopicRow | undefined | null) => {
    if (!r || excludeSlugs.has(r.slug) || seenIds.has(r.id)) return;
    seenIds.add(r.id);
    ordered.push(r);
  };

  if (categoryIdsFromRecent.length) {
    const catList = categoryIdsFromRecent.join(",");
    const { data: wildRows } = await supabase
      .from("topics")
      .select(
        "id, slug, title, hook_text, difficulty_level, estimated_minutes, category_id"
      )
      .eq("status", "published")
      .not("category_id", "in", `(${catList})`)
      .order("updated_at", { ascending: false })
      .limit(1);
    push((wildRows?.[0] as TopicRow) ?? null);

    const { data: pool } = await supabase
      .from("topics")
      .select(
        "id, slug, title, hook_text, difficulty_level, estimated_minutes, category_id"
      )
      .eq("status", "published")
      .in("category_id", categoryIdsFromRecent)
      .order("updated_at", { ascending: false })
      .limit(60);

    let sameCat = 0;
    for (const r of pool ?? []) {
      if (sameCat >= SAME_CATEGORY_MAX) break;
      const row = r as TopicRow;
      if (excludeSlugs.has(row.slug) || seenIds.has(row.id)) continue;
      seenIds.add(row.id);
      ordered.push(row);
      sameCat++;
    }
  }

  if (ordered.length < CAP) {
    const featured = await getFeaturedTopics(supabase);
    const slugs = featured.map((f) => f.slug);
    if (slugs.length) {
      const { data: featRows } = await supabase
        .from("topics")
        .select(
          "id, slug, title, hook_text, difficulty_level, estimated_minutes, category_id"
        )
        .eq("status", "published")
        .in("slug", slugs);
      const bySlug = new Map(
        (featRows ?? []).map((t) => [(t as TopicRow).slug, t as TopicRow])
      );
      const extra = rowFromFeaturedList(
        featured,
        bySlug,
        excludeSlugs,
        seenIds,
        CAP - ordered.length
      );
      ordered.push(...extra);
    }
  }

  if (!ordered.length) {
    const featured = await getFeaturedTopics(supabase);
    const slugs = featured.slice(0, CAP).map((f) => f.slug);
    if (!slugs.length) return [];
    const { data: rows } = await supabase
      .from("topics")
      .select(
        "id, slug, title, hook_text, difficulty_level, estimated_minutes, category_id"
      )
      .eq("status", "published")
      .in("slug", slugs);
    const bySlug = new Map(
      (rows ?? []).map((t) => [(t as TopicRow).slug, t as TopicRow])
    );
    for (const s of slugs) {
      const r = bySlug.get(s);
      if (r) ordered.push(r);
    }
  }

  return rowsToCards(supabase, ordered.slice(0, CAP));
}
