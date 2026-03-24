import type { QueryClient } from "@tanstack/react-query";
import {
  curiosityQueryKeys,
  discoveryQueryKeys,
  progressQueryKeys,
} from "@/lib/query/query-keys";

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
    queryKey: progressQueryKeys.completedTopicIds(id),
  });
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
    queryKey: progressQueryKeys.categoryXp(id),
  });
  void queryClient.invalidateQueries({
    queryKey: progressQueryKeys.profileProgress(id),
  });
  void queryClient.invalidateQueries({
    queryKey: [...progressQueryKeys.all, "category-progress"],
  });
  void queryClient.invalidateQueries({
    queryKey: discoveryQueryKeys.recent(id),
  });
  void queryClient.invalidateQueries({
    queryKey: discoveryQueryKeys.suggestedTopics(id),
  });
  void queryClient.invalidateQueries({
    queryKey: curiosityQueryKeys.daily(),
  });
  // Refetch discover topic lists so completed cards are hidden
  void queryClient.invalidateQueries({
    queryKey: ["discovery"],
  });
}
