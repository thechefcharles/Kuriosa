import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChallengeEmptyState({ slug }: { slug: string }) {
  return (
    <div
      className="mx-auto max-w-lg rounded-2xl border border-dashed border-violet-300/60 bg-white/90 px-6 py-10 text-center dark:border-white/15 dark:bg-slate-900/50"
      role="status"
    >
      <BookOpen className="mx-auto mb-4 h-10 w-10 text-kuriosa-electric-cyan" aria-hidden />
      <h2 className="text-lg font-semibold text-kuriosa-midnight-blue dark:text-slate-50">
        No challenge for this curiosity yet
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This topic doesn&apos;t have a quiz attached. You can keep reading or explore
        more topics.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href={ROUTES.curiosity(slug)}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
        >
          Back to lesson
        </Link>
        <Link
          href={ROUTES.discover}
          className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto")}
        >
          Browse Discover
        </Link>
      </div>
    </div>
  );
}
