import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function getCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, icon, description, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as Category[];
}
