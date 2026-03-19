/**
 * Internal preview entry point: same assembly as user-facing content load,
 * using the server Supabase client (cookies / RLS).
 */

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";
import { loadCuriosityExperience } from "@/lib/services/content/load-curiosity-experience";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";

export async function loadCuriosityPreviewBySlug(
  topicSlug: string
): Promise<LoadedCuriosityExperience | null> {
  const supabase = await createSupabaseServerClient();
  return loadCuriosityExperience(supabase, { slug: topicSlug });
}
