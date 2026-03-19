import type { UserBadgeView } from "@/types/progress-view";
import { BadgeCard } from "@/components/progress/badge-card";
import { Medal } from "lucide-react";

export function BadgeGrid({ badges }: { badges: UserBadgeView[] }) {
  if (!badges.length) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-300/60 bg-violet-50/40 px-6 py-10 text-center dark:border-white/15 dark:bg-slate-900/30">
        <Medal className="mx-auto mb-3 h-10 w-10 text-kuriosa-deep-purple/50 dark:text-kuriosa-electric-cyan/50" />
        <h3 className="font-semibold text-kuriosa-midnight-blue dark:text-slate-100">
          Badges unlock as you go
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          First curiosity, first streak, new categories — small wins add up. Your shelf will
          fill faster than you think.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
        Badges ({badges.length})
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {badges.map((b) => (
          <li key={b.badgeId}>
            <BadgeCard badge={b} />
          </li>
        ))}
      </ul>
    </div>
  );
}
