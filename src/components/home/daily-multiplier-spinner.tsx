"use client";

import { useState, useEffect } from "react";
import { XP_CONFIG } from "@/lib/progress/xp-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MULTIPLIERS = [...XP_CONFIG.DAILY_MULTIPLIERS];
const SPIN_REVOLUTIONS = 3;
const SPIN_ITEMS = [...Array(SPIN_REVOLUTIONS).fill(MULTIPLIERS).flat(), ...MULTIPLIERS];

export function DailyMultiplierSpinner({
  multiplier,
  hasSpun,
  onSpin,
  className,
}: {
  multiplier: number;
  /** True when user has clicked to reveal */
  hasSpun: boolean;
  /** Called when user clicks to spin */
  onSpin: () => void;
  className?: string;
}) {
  const index = MULTIPLIERS.indexOf(multiplier);
  const resolvedIndex = index >= 0 ? index : 1;
  const finalIndex = SPIN_REVOLUTIONS * MULTIPLIERS.length + resolvedIndex;
  const startIndex = finalIndex + 3;
  const [hasLanded, setHasLanded] = useState(false);

  useEffect(() => {
    if (!hasSpun) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setHasLanded(true));
    });
    return () => cancelAnimationFrame(id);
  }, [hasSpun]);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5",
        className
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-600/90 dark:text-amber-400/80">
        Today&apos;s boost
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onSpin}
        disabled={hasSpun}
        className={cn(
          "group relative h-auto overflow-hidden rounded-xl p-0",
          "border-2 border-amber-400/60 bg-gradient-to-b from-amber-100/90 to-amber-200/80",
          "hover:border-amber-500/80 hover:from-amber-150/95 hover:to-amber-250/90",
          "disabled:pointer-events-none disabled:opacity-100",
          "dark:border-amber-500/40 dark:from-amber-950/80 dark:to-amber-900/60",
          "dark:hover:border-amber-500/60"
        )}
      >
        <div
          className="relative h-12 w-16 overflow-hidden rounded-lg"
        >
          {!hasSpun ? (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <span className="text-sm font-bold uppercase tracking-wide text-amber-600 group-hover:text-amber-700 dark:text-amber-400 dark:group-hover:text-amber-300">
                Spin
              </span>
            </div>
          ) : (
            <div
              className="absolute inset-x-1 top-1/2 flex -translate-y-1/2 flex-col items-center justify-center transition-transform duration-[1800ms]"
              style={{
                transform: hasLanded
                  ? `translateY(calc(-${finalIndex} * 3rem - 1.5rem))`
                  : `translateY(calc(-${startIndex} * 3rem - 1.5rem))`,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {SPIN_ITEMS.map((m, i) => (
                <span
                  key={`${m}-${i}`}
                  className={cn(
                    "flex h-12 min-h-[3rem] shrink-0 items-center justify-center text-xl font-black tabular-nums",
                    "bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent",
                    "dark:from-amber-400 dark:via-amber-300 dark:to-yellow-400"
                  )}
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                >
                  {m}×
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Top/bottom fade masks */}
        {hasSpun && (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-amber-100 via-amber-100/80 to-transparent dark:from-amber-950 dark:via-amber-950/80"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-amber-100 via-amber-100/80 to-transparent dark:from-amber-950 dark:via-amber-950/80"
              aria-hidden
            />
          </>
        )}
      </Button>
    </div>
  );
}
