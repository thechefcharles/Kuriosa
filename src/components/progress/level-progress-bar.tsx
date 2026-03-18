import { cn } from "@/lib/utils";

export function LevelProgressBar({
  progress,
  className,
  labelId,
}: {
  /** 0–1 */
  progress: number;
  className?: string;
  labelId?: string;
}) {
  const pct = Math.min(100, Math.max(0, progress * 100));

  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-labelledby={labelId}
    >
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-kuriosa-deep-purple via-violet-500 to-kuriosa-electric-cyan transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
