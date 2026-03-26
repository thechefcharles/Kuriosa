"use client";

import Link from "next/link";
import { formatActivityEventParts } from "@/lib/services/social/format-activity-event";
import type { ActivityFeedItemView } from "@/types/activity-feed";
import { MOBILE_SAFE_ROUTES } from "@/lib/constants/routes";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

interface ActivityFeedItemProps {
  item: ActivityFeedItemView;
}

export function ActivityFeedItem({ item }: ActivityFeedItemProps) {
  const { name, beforeTopic, topicTitle, afterTopic } =
    formatActivityEventParts(item);
  const profileHref = MOBILE_SAFE_ROUTES.profilePublic(item.userId);
  const topicHref =
    item.topicSlug &&
    (item.type === "topic_completed" || item.type === "topic_shared")
      ? MOBILE_SAFE_ROUTES.curiosity(item.topicSlug)
      : null;

  return (
    <div className="flex items-start gap-3 py-3 -mx-2 rounded-lg px-2 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
      <div className="h-2 w-2 shrink-0 rounded-full bg-violet-400/70 mt-1.5 dark:bg-violet-500/80" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">
          <Link
            href={profileHref}
            className="font-medium hover:text-violet-600 dark:hover:text-violet-400 hover:underline"
          >
            {name}
          </Link>
          {beforeTopic}
          {topicHref && topicTitle ? (
            <Link
              href={topicHref}
              className="hover:text-violet-600 dark:hover:text-violet-400 hover:underline"
            >
              {topicTitle}
            </Link>
          ) : topicTitle ? (
            topicTitle
          ) : null}
          {afterTopic}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatRelativeTime(item.createdAt)}
        </p>
      </div>
    </div>
  );
}
