import { Compass } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export function HomeDailyEmpty() {
  return (
    <EmptyState
      title="No daily curiosity yet"
      description="We're not featuring a topic today. Check back soon, or explore Discover for more."
      icon={<Compass className="mx-auto mb-3 h-10 w-10 text-kuriosa-electric-cyan/80" aria-hidden />}
      className="rounded-2xl border border-dashed border-violet-300/50 bg-white/80 px-6 py-10 dark:border-white/15 dark:bg-slate-900/50"
    />
  );
}

export function HomeDailyError({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl border border-rose-200/80 bg-rose-50/90 px-5 py-8 text-center dark:border-rose-900/40 dark:bg-rose-950/30"
      role="alert"
    >
      <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">
        Unable to load today&apos;s curiosity
      </p>
      <p className="mt-2 text-sm text-rose-800/90 dark:text-rose-200/80">
        {message || "Something went wrong. Pull to refresh or try again in a moment."}
      </p>
    </div>
  );
}
