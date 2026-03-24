"use client";

import { cn } from "@/lib/utils";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "All" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

const DIFFICULTY_BUTTON_STYLES: Record<string, { base: string; selected: string }> = {
  "": {
    base: "border-slate-300 bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:border-white/15 dark:bg-slate-800 dark:hover:bg-slate-700",
    selected: "border-slate-500 bg-slate-200 text-slate-900 dark:border-white/30 dark:bg-slate-600 dark:text-white",
  },
  beginner: {
    base: "border-emerald-400 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:border-emerald-600 dark:bg-emerald-900/80 dark:text-emerald-100 dark:hover:bg-emerald-800/90",
    selected: "border-emerald-600 bg-emerald-200 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-800 dark:text-emerald-50",
  },
  intermediate: {
    base: "border-amber-400 bg-amber-100 text-amber-900 hover:bg-amber-200 dark:border-amber-600 dark:bg-amber-900/80 dark:text-amber-100 dark:hover:bg-amber-800/90",
    selected: "border-amber-600 bg-amber-200 text-amber-950 dark:border-amber-500 dark:bg-amber-800 dark:text-amber-50",
  },
  advanced: {
    base: "border-rose-400 bg-rose-100 text-rose-900 hover:bg-rose-200 dark:border-rose-600 dark:bg-rose-900/80 dark:text-rose-100 dark:hover:bg-rose-800/90",
    selected: "border-rose-600 bg-rose-200 text-rose-950 dark:border-rose-500 dark:bg-rose-800 dark:text-rose-50",
  },
};

export type DiscoverDifficultyFilterProps = {
  value: string;
  onChange: (value: string) => void;
  searchActive?: boolean;
  className?: string;
};

export function DiscoverDifficultyFilter({
  value,
  onChange,
  searchActive = false,
  className,
}: DiscoverDifficultyFilterProps) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-center justify-center gap-2",
        searchActive && "opacity-75",
        className
      )}
    >
      <span className="sr-only">Filter by difficulty</span>
      {DIFFICULTY_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        const styles = DIFFICULTY_BUTTON_STYLES[opt.value] ?? DIFFICULTY_BUTTON_STYLES[""];
        return (
          <button
            key={opt.value || "all"}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              selected ? styles.selected : styles.base
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
