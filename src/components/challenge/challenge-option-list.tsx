"use client";

import { cn } from "@/lib/utils";
import type { CuriosityQuizOption } from "@/types/curiosity-experience";

export function ChallengeOptionList({
  options,
  selectedIndex,
  onSelect,
  disabled,
  name,
}: {
  options: CuriosityQuizOption[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  disabled: boolean;
  name: string;
}) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label="Answer choices">
      {options.map((opt, i) => {
        const selected = selectedIndex === i;
        return (
          <label
            key={`${i}-${opt.optionText.slice(0, 24)}`}
            className={cn(
              "flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
              selected
                ? "border-kuriosa-deep-purple bg-kuriosa-deep-purple/10 dark:border-kuriosa-electric-cyan dark:bg-kuriosa-electric-cyan/10"
                : "border-slate-200/90 bg-white/80 hover:border-kuriosa-electric-cyan/40 dark:border-white/10 dark:bg-slate-900/40",
              disabled && "pointer-events-none opacity-60"
            )}
          >
            <input
              type="radio"
              name={name}
              className="mt-1 size-4 shrink-0 accent-kuriosa-deep-purple dark:accent-kuriosa-electric-cyan"
              checked={selected}
              onChange={() => onSelect(i)}
              disabled={disabled}
            />
            <span className="text-[15px] leading-snug text-foreground">{opt.optionText}</span>
          </label>
        );
      })}
    </div>
  );
}
