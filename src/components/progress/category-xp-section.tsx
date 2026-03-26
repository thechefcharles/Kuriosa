"use client";

import { useUserCategoryXp } from "@/hooks/queries/useUserCategoryXp";
import { getCategoryTheme } from "@/lib/constants/category-themes";
import { FolderTree } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

export function CategoryXpSection() {
  const { data: entries, isPending, error, isAuthenticated } = useUserCategoryXp();

  if (!isAuthenticated || isPending || error) return null;

  const hasEntries = entries && entries.length > 0;

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
        <span className="inline-flex items-center gap-1.5">
          <FolderTree className="h-4 w-4" aria-hidden />
          XP by category
        </span>
      </h2>
      {!hasEntries ? (
        <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-muted-foreground dark:border-slate-700">
          Complete curiosities to earn XP in each category — your progress will appear here.
        </p>
      ) : (
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {entries!.map((entry) => {
          const theme = getCategoryTheme(entry.categorySlug);
          const Icon = theme.icon;
          return (
            <li key={entry.categoryId}>
              <Link
                href={ROUTES.progressCategory(entry.categorySlug)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 shadow-sm transition-colors",
                  theme.card,
                  "hover:shadow-md"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    theme.bar,
                    "text-white"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm font-medium", theme.label)}>
                    {entry.categoryName}
                  </p>
                  <p className="text-lg font-bold tabular-nums text-kuriosa-midnight-blue dark:text-white">
                    {entry.totalXp.toLocaleString()} XP
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      )}
    </div>
  );
}
