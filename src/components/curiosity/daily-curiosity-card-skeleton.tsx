export function DailyCuriosityCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg dark:border-white/10 dark:bg-slate-900/60"
      aria-busy="true"
      aria-label="Loading today’s curiosity"
    >
      <div className="mb-2 h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-3 h-8 w-4/5 max-w-sm rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-6 space-y-2">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 max-w-[92%] rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}
