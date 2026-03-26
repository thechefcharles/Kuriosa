"use client";

import Link from "next/link";
import type { RecentTopicView } from "@/types/discovery";
import { ROUTES } from "@/lib/constants/routes";
import { BookOpen } from "lucide-react";

interface ProfileTopicsProps {
  topics: RecentTopicView[];
  totalCount: number;
}

export function ProfileTopics({ topics, totalCount }: ProfileTopicsProps) {
  if (totalCount === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 px-4 py-6 text-center dark:border-white/10 dark:bg-slate-900/30">
        <BookOpen className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
        <p className="mt-3 text-sm text-muted-foreground">
          No topics explored yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/40">
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
        Recently explored
      </h2>
      {topics.length > 0 && (
        <ul className="space-y-2">
          {topics.slice(0, 5).map((t) => (
            <li key={t.id}>
              <Link
                href={ROUTES.curiosity(t.slug)}
                className="block rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                {t.title}
                {t.categoryName && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    · {t.categoryName}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {totalCount > 5 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {totalCount} topics explored in total
        </p>
      )}
    </div>
  );
}
