"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
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
      id="daily-boost-spinner"
      className={cn(
        "flex flex-col items-center",
        className
      )}
    >
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
          "dark:hover:border-amber-500/60",
          !hasSpun && "shadow-[0_0_24px_rgba(245,158,11,0.6)] dark:shadow-[0_0_24px_rgba(251,191,36,0.5)]",
          !hasSpun && "animate-[spin-glow_2s_ease-in-out_infinite,boost-pulsate_1.8s_ease-in-out_infinite]"
        )}
      >
        <div
          className={cn(
            "relative flex h-12 items-center justify-center overflow-hidden rounded-lg",
            !hasSpun ? "min-w-[6rem] px-5" : "min-w-[6rem]"
          )}
        >
          {!hasSpun ? (
            <div className="flex h-full w-full items-center justify-center gap-1.5">
              <Zap className="h-4 w-4 shrink-0 fill-amber-500 text-amber-600 group-hover:fill-amber-400 group-hover:text-amber-500 dark:fill-amber-400 dark:text-amber-400 dark:group-hover:fill-amber-300 dark:group-hover:text-amber-300" aria-hidden />
              <span className="text-sm font-bold uppercase tracking-wide text-amber-600 group-hover:text-amber-700 dark:text-amber-400 dark:group-hover:text-amber-300">
                Boost
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
