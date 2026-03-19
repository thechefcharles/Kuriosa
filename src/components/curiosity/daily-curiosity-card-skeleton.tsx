export function DailyCuriosityCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/60"
      aria-busy="true"
      aria-label="Loading today’s curiosity"
    >
      <div className="mb-4 h-5 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mb-2 h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-4 h-8 w-4/5 max-w-md rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-6 space-y-2">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 max-w-[92%] rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mb-6 flex gap-3">
        <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}
