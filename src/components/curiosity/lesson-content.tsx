"use client";

import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { cn } from "@/lib/utils";

export type LessonContentProps = {
  experience: LoadedCuriosityExperience;
  className?: string;
  listenMode?: boolean;
  /** Optional play button to show at the start of the main text */
  playButtonSlot?: React.ReactNode;
  /** Text color class (e.g. from difficulty theme) */
  textClassName?: string;
};

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
  playButtonSlot,
  textClassName = "text-slate-800 dark:text-slate-200",
}: LessonContentProps) {
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
      {playButtonSlot ? (
        <div className="flex items-start gap-3">
          <div className="pt-0.5">{playButtonSlot}</div>
          <div className="min-w-0 flex-1 space-y-3">
            {lessonParagraphs.length ? (
              lessonParagraphs.map((p, i) => (
                <p
                  key={`${i}-${p.slice(0, 12)}`}
                  className={cn(
                    textClassName,
                    listenMode ? "text-sm leading-6" : "text-[15px] leading-7"
                  )}
                >
                  {p}
                </p>
              ))
            ) : (
              <p className={cn("text-[15px] leading-7", textClassName)}>
                Lesson content isn't available yet.
              </p>
            )}
          </div>
        </div>
      ) : (
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
                textClassName,
                listenMode ? "text-sm leading-6" : "text-[15px] leading-7"
              )}
            >
              {p}
            </p>
          ))
        ) : (
          <p className={cn("text-[15px] leading-7", textClassName)}>
            Lesson content isn’t available yet.
          </p>
        )}
      </div>
      )}

      {experience.lesson.surprisingFact ? (
        <section className="rounded-2xl border border-white/30 bg-white/40 p-5 dark:border-white/10 dark:bg-white/5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-80">
            Surprising fact
          </div>
          <p className={cn("text-base leading-7", textClassName)}>
            {experience.lesson.surprisingFact}
          </p>
        </section>
      ) : null}

    </div>
  );
}

