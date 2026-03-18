"use client";

import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { cn } from "@/lib/utils";

function splitIntoParagraphs(text: string): string[] {
  // Prefer blank-line paragraph breaks; fallback to line breaks.
  const t = text.replace(/\r\n/g, "\n").trim();
  if (!t) return [];
  const byBlankLines = t.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);
  if (byBlankLines.length >= 2) return byBlankLines;
  return t.split(/\n/g).map((p) => p.trim()).filter(Boolean);
}

export function LessonContent({
  experience,
  className,
  listenMode = false,
}: {
  experience: LoadedCuriosityExperience;
  className?: string;
  listenMode?: boolean;
}) {
  const lessonParagraphs = splitIntoParagraphs(experience.lesson.lessonText);

  return (
    <div
      className={cn(
        "space-y-6",
        listenMode &&
          "rounded-2xl border border-slate-200/60 bg-white/40 p-4 dark:border-white/10 dark:bg-slate-900/25 sm:p-5",
        className
      )}
    >
      {listenMode ? (
        <h2 className="text-xs font-bold uppercase tracking-widest text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
          Written lesson
        </h2>
      ) : null}
      <div
        className={cn(
          "space-y-3",
          listenMode &&
            "max-h-[min(50vh,20rem)] overflow-y-auto pr-1 sm:max-h-[min(45vh,24rem)]"
        )}
      >
        {lessonParagraphs.length ? (
          lessonParagraphs.map((p, i) => (
            <p
              key={`${i}-${p.slice(0, 12)}`}
              className={cn(
                "text-slate-800 dark:text-slate-200",
                listenMode ? "text-sm leading-6" : "text-[15px] leading-7"
              )}
            >
              {p}
            </p>
          ))
        ) : (
          <p className="text-[15px] leading-7 text-slate-800 dark:text-slate-200">
            Lesson content isn’t available yet.
          </p>
        )}
      </div>

      {experience.lesson.surprisingFact ? (
        <section className="rounded-2xl border border-violet-200/80 bg-violet-50/60 p-5 dark:border-violet-900/40 dark:bg-violet-950/20">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-kuriosa-electric-cyan dark:text-kuriosa-electric-cyan/90">
            Surprising fact
          </div>
          <p className="text-base leading-7 text-slate-800 dark:text-slate-100">
            {experience.lesson.surprisingFact}
          </p>
        </section>
      ) : null}

      {experience.lesson.realWorldRelevance ? (
        <section className="rounded-2xl border border-slate-200/80 bg-white/60 p-5 dark:border-white/10 dark:bg-slate-900/30">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
            Why it matters
          </div>
          <p className="text-base leading-7 text-slate-700 dark:text-slate-200">
            {experience.lesson.realWorldRelevance}
          </p>
        </section>
      ) : null}
    </div>
  );
}

