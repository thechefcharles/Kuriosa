"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { CuriosityTrail } from "@/types/curiosity-experience";
import { cn } from "@/lib/utils";

export function TrailCard({ trail }: { trail: CuriosityTrail }) {
  const href = ROUTES.curiosity(trail.toTopicSlug);
  const teaser = trail.reasonText.trim().slice(0, 140);
  const teaserEllipsis = trail.reasonText.trim().length > 140 ? "…" : "";

  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-[72px] flex-col gap-1 rounded-xl border border-slate-200/90 bg-gradient-to-br from-white to-cyan-50/40 p-4 shadow-sm transition-all",
        "hover:border-kuriosa-electric-cyan/50 hover:shadow-md dark:border-white/10 dark:from-slate-900 dark:to-kuriosa-deep-purple/15 dark:hover:border-kuriosa-electric-cyan/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-kuriosa-electric-cyan/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-kuriosa-midnight-blue dark:text-kuriosa-electric-cyan">
            <Compass className="h-3 w-3" aria-hidden />
            Next curiosity
          </span>
          <h3 className="mt-2 text-base font-bold leading-snug text-kuriosa-midnight-blue group-hover:text-kuriosa-deep-purple dark:text-slate-50 dark:group-hover:text-kuriosa-electric-cyan">
            {trail.toTopicTitle}
          </h3>
        </div>
        <ArrowRight
          className="mt-6 h-5 w-5 shrink-0 text-kuriosa-deep-purple opacity-70 transition-transform group-hover:translate-x-0.5 dark:text-kuriosa-electric-cyan"
          aria-hidden
        />
      </div>
      {(teaser || teaserEllipsis) && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {teaser}
          {teaserEllipsis}
        </p>
      )}
      <span className="text-xs font-medium text-kuriosa-electric-cyan dark:text-kuriosa-electric-cyan/90">
        Open topic →
      </span>
    </Link>
  );
}
