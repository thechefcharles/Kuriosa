import { BookOpen, FolderTree, Target, Shuffle, CheckCircle2 } from "lucide-react";
import type { ProgressStatsView } from "@/types/progress-view";

const items = (
  stats: ProgressStatsView
): {
  label: string;
  value: string;
  sub?: string;
  icon: typeof BookOpen;
}[] => [
  {
    label: "Topics completed",
    value: stats.totalTopicsCompleted.toLocaleString(),
    sub: "curiosities finished",
    icon: BookOpen,
  },
  {
    label: "Categories",
    value: stats.categoriesExplored.toLocaleString(),
    sub: "explored",
    icon: FolderTree,
  },
  {
    label: "Badges",
    value: stats.badgesEarned.toLocaleString(),
    sub: "earned",
    icon: Target,
  },
  {
    label: "Random finds",
    value: stats.randomCompletionsCount.toLocaleString(),
    sub: "via spin",
    icon: Shuffle,
  },
  {
    label: "Perfect challenges",
    value: stats.perfectChallengesCount.toLocaleString(),
    sub: "100% correct",
    icon: CheckCircle2,
  },
];

export function StatGrid({ stats }: { stats: ProgressStatsView }) {
  const cells = items(stats);

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
        By the numbers
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cells.map(({ label, value, sub, icon: Icon }) => (
          <li
            key={label}
            className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/50"
          >
            <Icon
              className="mb-2 h-5 w-5 text-kuriosa-electric-cyan"
              aria-hidden
            />
            <p className="text-2xl font-bold tabular-nums text-kuriosa-midnight-blue dark:text-white">
              {value}
            </p>
            <p className="text-xs font-medium text-foreground">{label}</p>
            {sub ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
