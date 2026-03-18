import type { QueryClient } from "@tanstack/react-query";
import { progressQueryKeys } from "@/lib/query/query-keys";

/**
 * Refetch progress-related queries after completion, badge unlock, etc.
 * Pass the signed-in user's id so only their keys are invalidated.
 */
export function invalidateProgressQueries(
  queryClient: QueryClient,
  userId: string | null | undefined
): void {
  const id = userId?.trim();
  if (!id) {
    queryClient.invalidateQueries({ queryKey: progressQueryKeys.all });
    return;
  }
  void queryClient.invalidateQueries({
    queryKey: progressQueryKeys.summary(id),
  });
  void queryClient.invalidateQueries({
    queryKey: progressQueryKeys.badges(id),
  });
  void queryClient.invalidateQueries({
    queryKey: progressQueryKeys.stats(id),
  });
  void queryClient.invalidateQueries({
    queryKey: progressQueryKeys.profileProgress(id),
  });
}
