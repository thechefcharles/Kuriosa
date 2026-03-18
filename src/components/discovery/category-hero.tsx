import type { CategoryView } from "@/types/discovery";
import { Layers } from "lucide-react";

export function CategoryHero({ category }: { category: CategoryView }) {
  const count =
    typeof category.topicCount === "number" ? category.topicCount : null;
  const desc = category.description?.trim();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-200/50 bg-gradient-to-br from-violet-50 via-white to-cyan-50/40 p-6 shadow-sm dark:border-white/10 dark:from-kuriosa-midnight-blue dark:via-slate-900 dark:to-slate-950 sm:p-8">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-kuriosa-electric-cyan/10 blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-kuriosa-electric-cyan/30 bg-white/70 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-kuriosa-deep-purple dark:bg-white/10 dark:text-kuriosa-electric-cyan">
          <Layers className="h-3.5 w-3.5" aria-hidden />
          Category
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-kuriosa-midnight-blue dark:text-white sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Explore curiosities in <strong className="text-foreground">{category.name}</strong>
          {count != null ? (
            <>
              {" "}
              — <span className="tabular-nums">{count}</span> published topic
              {count === 1 ? "" : "s"} to browse.
            </>
          ) : (
            ". Pick a card below to read, listen, and challenge yourself."
          )}
        </p>
        {desc ? (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground line-clamp-3 sm:line-clamp-4">
            {desc}
          </p>
        ) : null}
      </div>
    </div>
  );
}
