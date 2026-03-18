/**
 * Verification helpers for seeded content.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";

export interface SeedInventorySummary {
  totalTopics: number;
  byCategorySlug: Record<string, number>;
  byStatus: Record<string, number>;
}

export async function fetchSeedInventorySummary(): Promise<SeedInventorySummary> {
  const supabase = getSupabaseServiceRoleClient();

  const { data: topics, error } = await supabase
    .from("topics")
    .select("id, slug, status, category_id");

  if (error || !topics) {
    throw new Error(error?.message ?? "Failed to load topics");
  }

  const categoryIds = [...new Set(topics.map((t: any) => String(t.category_id)))];
  const { data: categories } = categoryIds.length
    ? await supabase.from("categories").select("id, slug").in("id", categoryIds)
    : { data: [] };

  const catSlugById = new Map(
    (categories ?? []).map((c: any) => [String(c.id), String(c.slug)])
  );

  const byCategorySlug: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const t of topics as any[]) {
    const catSlug = catSlugById.get(String(t.category_id)) ?? "unknown";
    byCategorySlug[catSlug] = (byCategorySlug[catSlug] ?? 0) + 1;
    const status = String(t.status ?? "draft");
    byStatus[status] = (byStatus[status] ?? 0) + 1;
  }

  return {
    totalTopics: topics.length,
    byCategorySlug,
    byStatus,
  };
}

