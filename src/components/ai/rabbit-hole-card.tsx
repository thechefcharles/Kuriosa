"use client";

import { Compass, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function RabbitHoleCard({
  title,
  reasonText,
  onSelect,
}: {
  title: string;
  reasonText?: string;
  onSelect: () => void;
}) {
  const teaser = (reasonText ?? "").trim().slice(0, 120);
  const ellipsis = (reasonText ?? "").length > 120 ? "…" : "";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex w-full min-h-[72px] flex-col gap-2 rounded-xl border-2 border-slate-200/90 bg-gradient-to-br from-white to-cyan-50/50 p-4 text-left shadow-sm transition-all",
        "active:scale-[0.99] hover:border-kuriosa-electric-cyan/55 hover:shadow-md",
        "dark:border-white/12 dark:from-slate-900 dark:to-kuriosa-deep-purple/20 dark:hover:border-kuriosa-electric-cyan/40"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-kuriosa-electric-cyan/18">
          <Compass className="h-4 w-4 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-kuriosa-midnight-blue group-hover:text-kuriosa-deep-purple dark:text-slate-50 dark:group-hover:text-kuriosa-electric-cyan">
            {title}
          </h3>
          {teaser ? (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {teaser}
              {ellipsis}
            </p>
          ) : null}
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-kuriosa-electric-cyan/70 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}
