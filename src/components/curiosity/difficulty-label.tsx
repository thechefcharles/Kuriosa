import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<string, string> = {
  beginner:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  intermediate:
    "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
  advanced:
    "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200",
  expert:
    "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200",
};

function formatDifficulty(raw: string): string {
  const s = raw.trim().toLowerCase().replace(/_/g, " ");
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : "Curiosity";
}

export function DifficultyLabel({ level }: { level: string }) {
  const key = level.trim().toLowerCase();
  const style =
    LEVEL_STYLES[key] ??
    "border-kuriosa-electric-cyan/30 bg-kuriosa-electric-cyan/10 text-kuriosa-midnight-blue dark:text-kuriosa-electric-cyan";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style
      )}
    >
      {formatDifficulty(level)}
    </span>
  );
}
