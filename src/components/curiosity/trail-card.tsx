"use client";

import Link from "next/link";
import { ChevronRight, Compass } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import type { CuriosityTrail } from "@/types/curiosity-experience";
import { cn } from "@/lib/utils";

export function TrailCard({ trail }: { trail: CuriosityTrail }) {
  const slug = trail.toTopicSlug.trim();
  const href = ROUTES.curiosity(slug);
  const title =
    (trail.toTopicTitle ?? "").trim() || slug.replace(/-/g, " ");
  const reason = trail.reasonText.trim();
  const teaser = reason.slice(0, 160);
  const teaserEllipsis = reason.length > 160 ? "…" : "";

  return (
    <Link
      href={href}
      onClick={() =>
        setTopicDiscoveryContext(slug, {
          wasDailyFeature: false,
          wasRandomSpin: false,
        })
      }
      className={cn(
        "group relative flex min-h-[88px] flex-col gap-2 rounded-xl border-2 border-slate-200/90 bg-gradient-to-br from-white to-cyan-50/50 p-4 shadow-sm transition-all",
        "active:scale-[0.99] hover:border-kuriosa-electric-cyan/55 hover:shadow-md",
        "dark:border-white/12 dark:from-slate-900 dark:to-kuriosa-deep-purple/20 dark:hover:border-kuriosa-electric-cyan/40"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-kuriosa-electric-cyan/18 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-kuriosa-midnight-blue dark:text-kuriosa-electric-cyan">
            <Compass className="h-3 w-3 shrink-0" aria-hidden />
            Next curiosity
          </span>
          <h3 className="text-base font-bold leading-snug text-kuriosa-midnight-blue group-hover:text-kuriosa-deep-purple dark:text-slate-50 dark:group-hover:text-kuriosa-electric-cyan sm:text-[1.05rem]">
            {title}
          </h3>
          {reason ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-kuriosa-deep-purple/80 dark:text-kuriosa-electric-cyan/80">
                Why next:{" "}
              </span>
              {teaser}
              {teaserEllipsis}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              Continue the thread — open when you&apos;re ready for the next rabbit hole.
            </p>
          )}
        </div>
        <span
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-kuriosa-electric-cyan/25 bg-kuriosa-electric-cyan/10 text-kuriosa-deep-purple transition-transform group-hover:translate-x-0.5 dark:border-kuriosa-electric-cyan/30 dark:bg-kuriosa-electric-cyan/15 dark:text-kuriosa-electric-cyan"
          aria-hidden
        >
          <ChevronRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}
