/**
 * Phase 10.2 — Metadata for curiosity route (title, description).
 * Future-friendly for OG/link previews; no OG image generation.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";

export type CuriosityPageMetadata = {
  title: string;
  description: string;
};

/**
 * Fetch title and description for a curiosity topic by slug.
 */
export async function getCuriosityPageMetadata(
  slug: string
): Promise<CuriosityPageMetadata | null> {
  const s = slug?.trim();
  if (!s) return null;

  try {
    const supabase = getSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("topics")
      .select("title, hook_text, lesson_text")
      .eq("slug", s)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) return null;

    const title = String(data.title ?? "").trim() || "Curiosity";
    const hook = String(data.hook_text ?? "").trim();
    const lesson = String(data.lesson_text ?? "").trim();
    const snippet = hook || lesson.slice(0, 160) || title;
    const description = snippet.slice(0, 160);

    return {
      title: `${title} | Kuriosa`,
      description,
    };
  } catch {
    return null;
  }
}
