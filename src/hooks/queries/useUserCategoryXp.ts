"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getUserCategoryXp } from "@/lib/services/progress/get-user-category-xp";
import { progressQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { CategoryXpEntry } from "@/lib/services/progress/get-user-category-xp";

export function useUserCategoryXp() {
  const supabase = createSupabaseBrowserClient();
  const { data: userId, isPending: authPending } = useAuthUserId();

  const q = useQuery<CategoryXpEntry[], Error>({
    queryKey: progressQueryKeys.categoryXp(userId ?? "__none__"),
    queryFn: async () => {
      if (!userId) return [];
      return getUserCategoryXp(supabase, userId);
    },
    enabled: Boolean(userId),
  });

  return {
    ...q,
    isPending: authPending || (Boolean(userId) && q.isPending),
    isAuthenticated: Boolean(userId),
  };
}
