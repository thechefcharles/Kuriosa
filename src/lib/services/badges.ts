import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";

export type Badge = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  criteria_type: string;
  criteria_value: string | null;
  created_at: string;
  updated_at: string;
};

export async function getBadges(): Promise<Badge[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("badges")
    .select("id, name, slug, description, icon, criteria_type, criteria_value, created_at, updated_at")
    .order("slug", { ascending: true });

  if (error) return [];
  return (data ?? []) as Badge[];
}
