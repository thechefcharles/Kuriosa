"use client";

import { useEffect, useState } from "react";
import { XP_CONFIG } from "@/lib/progress/xp-config";
import { cn } from "@/lib/utils";

const MULTIPLIERS = [...XP_CONFIG.DAILY_MULTIPLIERS];
const SPIN_REVOLUTIONS = 3;
const SPIN_ITEMS = [...Array(SPIN_REVOLUTIONS).fill(MULTIPLIERS).flat(), ...MULTIPLIERS];

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const fn = () => setPrefersReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return prefersReduced;
}

export function DailyMultiplierSpinner({
  multiplier,
  className,
}: {
  multiplier: number;
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasSpun, setHasSpun] = useState(false);
  const index = MULTIPLIERS.indexOf(multiplier);
  const resolvedIndex = index >= 0 ? index : 1;
  const finalIndex = SPIN_REVOLUTIONS * MULTIPLIERS.length + resolvedIndex;
  const startIndex = finalIndex + 3;

  useEffect(() => {
    if (prefersReducedMotion) {
      setHasSpun(true);
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setHasSpun(true));
    });
    return () => cancelAnimationFrame(id);
  }, [prefersReducedMotion]);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1",
        className
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-600/90 dark:text-amber-400/80">
        Today&apos;s boost
      </span>
      <div
        className={cn(
          "relative h-12 w-16 overflow-hidden rounded-xl",
          "border-2 border-amber-400/60 bg-gradient-to-b from-amber-100/90 to-amber-200/80",
          "shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)]",
          "dark:border-amber-500/40 dark:from-amber-950/80 dark:to-amber-900/60"
        )}
      >
        <div
          className="absolute inset-x-1 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-transform duration-[1800ms]"
          style={{
            transform: hasSpun
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
              style={{
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              {m}×
            </span>
          ))}
        </div>
        {/* Top/bottom fade masks for depth */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-amber-100 via-amber-100/80 to-transparent dark:from-amber-950 dark:via-amber-950/80"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-amber-100 via-amber-100/80 to-transparent dark:from-amber-950 dark:via-amber-950/80"
          aria-hidden
        />
      </div>
    </div>
  );
}
