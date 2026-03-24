export function DailyCuriosityCardSkeleton() {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-xl border border-slate-200/80 shadow-lg dark:border-white/10 dark:bg-slate-900/60"
      aria-busy="true"
      aria-label="Loading today’s curiosity"
    >
      <div className="h-12 bg-slate-300 dark:bg-slate-700" />
      <div className="h-1 bg-slate-300 dark:bg-slate-700" />
      <div className="border-slate-200/90 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-4/5 max-w-sm rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
