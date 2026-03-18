"use client";

import { cn } from "@/lib/utils";

export type CuriosityMode = "read" | "listen";

export function ModeToggle({
  mode,
  onModeChange,
  hasAudio,
}: {
  mode: CuriosityMode;
  onModeChange: (next: CuriosityMode) => void;
  hasAudio: boolean;
}) {
  const readActive = mode === "read";
  const listenActive = mode === "listen";

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/60 p-1 dark:border-white/10 dark:bg-slate-900/40">
      <button
        type="button"
        onClick={() => onModeChange("read")}
        aria-pressed={readActive}
        className={cn(
          "flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
          readActive
            ? "bg-kuriosa-deep-purple/15 text-kuriosa-midnight-blue dark:bg-kuriosa-electric-cyan/15 dark:text-kuriosa-electric-cyan"
            : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        Read
      </button>
      <button
        type="button"
        onClick={() => onModeChange("listen")}
        aria-pressed={listenActive}
        className={cn(
          "flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
          listenActive
            ? "bg-kuriosa-midnight-blue text-white dark:bg-kuriosa-electric-cyan dark:text-kuriosa-midnight-blue/90"
            : !hasAudio
              ? "text-muted-foreground opacity-80 hover:bg-slate-100 dark:hover:bg-slate-800"
              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        Listen
      </button>
    </div>
  );
}

