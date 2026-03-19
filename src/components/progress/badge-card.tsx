import type { UserBadgeView } from "@/types/progress-view";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function BadgeCard({ badge, compact }: { badge: UserBadgeView; compact?: boolean }) {
  const showIcon = badge.icon && /^https?:\/\//i.test(badge.icon);

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-violet-200/60 bg-gradient-to-b from-white to-violet-50/50 p-4 shadow-sm dark:border-white/10 dark:from-slate-900 dark:to-kuriosa-midnight-blue/80",
        compact && "p-3"
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-kuriosa-deep-purple to-kuriosa-electric-cyan text-white shadow-md",
            compact ? "h-10 w-10 text-sm font-bold" : "h-12 w-12 text-base font-bold"
          )}
          aria-hidden
        >
          {showIcon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={badge.icon!} alt="" className="h-full w-full rounded-lg object-cover" />
          ) : (
            initials(badge.name)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 shrink-0 text-kuriosa-electric-cyan" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
              Earned
            </span>
          </div>
          <h3 className="truncate font-semibold text-kuriosa-midnight-blue dark:text-white">
            {badge.name}
          </h3>
        </div>
      </div>
      {badge.description && !compact ? (
        <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
          {badge.description}
        </p>
      ) : null}
      <p className="mt-2 text-[10px] text-muted-foreground">
        {new Date(badge.earnedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
