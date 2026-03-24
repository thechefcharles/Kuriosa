"use client";

import { ChevronDown } from "lucide-react";
import type { CategoryView } from "@/types/discovery";
import { cn } from "@/lib/utils";

export type DiscoverCategorySelectProps = {
  categories: CategoryView[] | undefined;
  isLoading: boolean;
  isError: boolean;
  /** Currently selected category slug, or empty for "all" */
  value?: string;
  onCategoryChange?: (slug: string) => void;
  searchActive?: boolean;
  className?: string;
};

export function DiscoverCategorySelect({
  categories,
  isLoading,
  isError,
  value = "",
  onCategoryChange,
  searchActive = false,
  className,
}: DiscoverCategorySelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    onCategoryChange?.(slug);
  };

  return (
    <div
      className={cn(
        "relative mb-4",
        searchActive && "opacity-75",
        className
      )}
    >
      <label htmlFor="discover-category-select" className="sr-only">
        Select category
      </label>
      <select
        id="discover-category-select"
        disabled={isLoading || isError || !categories?.length}
        onChange={handleChange}
        value={value}
        className={cn(
          "h-11 w-full appearance-none rounded-xl border border-slate-200/90 bg-white/90 pl-4 pr-10 text-sm font-medium text-kuriosa-midnight-blue",
          "focus:outline-none focus:ring-2 focus:ring-kuriosa-electric-cyan/40",
          "dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        <option value="" disabled={isLoading || isError || !categories?.length}>
          {isLoading
            ? "Loading…"
            : isError
              ? "Couldn't load categories"
              : !categories?.length
                ? "No categories yet"
                : "All categories"}
        </option>
        {categories?.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
            {c.topicCount != null ? ` (${c.topicCount})` : ""}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}
