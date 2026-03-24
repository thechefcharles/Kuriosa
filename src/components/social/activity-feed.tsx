"use client";

import { useActivityFeed } from "@/hooks/queries/useActivityFeed";
import { ActivityFeedItem } from "./activity-feed-item";
import { ActivityFeedEmpty } from "./activity-feed-empty";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";

export function ActivityFeed() {
  const { data: items, isPending, isError, error } = useActivityFeed({
    limit: 15,
  });

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error?.message ??
          "Activity didn’t load. Try again later."
        }
      />
    );
  }

  if (!items?.length) {
    return <ActivityFeedEmpty />;
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
      {items.map((item) => (
        <ActivityFeedItem key={item.id} item={item} />
      ))}
    </div>
  );
}
