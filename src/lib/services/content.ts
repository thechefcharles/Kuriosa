import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";

/** Placeholder: returns null until daily curiosity is seeded. */
export async function getDailyCuriosity(): Promise<{
  date: string;
  topic_id: string;
  theme: string | null;
} | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("daily_curiosity")
    .select("date, topic_id, theme")
    .eq("date", new Date().toISOString().slice(0, 10))
    .maybeSingle();

  return data as { date: string; topic_id: string; theme: string | null } | null;
}

/** Placeholder: returns null until topics are seeded. */
export async function getTopicBySlug(slug: string): Promise<{
  id: string;
  title: string;
  slug: string;
  category_id: string;
  lesson_text: string;
} | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("topics")
    .select("id, title, slug, category_id, lesson_text")
    .eq("slug", slug)
    .maybeSingle();

  return data as { id: string; title: string; slug: string; category_id: string; lesson_text: string } | null;
}
