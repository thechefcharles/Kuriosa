import Link from "next/link";
import { Compass } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CategoryEmptyState({ categoryName }: { categoryName: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-violet-300/60 bg-violet-50/30 px-6 py-12 text-center dark:border-white/15 dark:bg-slate-900/40">
      <Compass className="mx-auto mb-4 h-10 w-10 text-kuriosa-deep-purple/60 dark:text-kuriosa-electric-cyan/60" />
      <h2 className="text-lg font-semibold text-kuriosa-midnight-blue dark:text-white">
        Nothing published here yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {categoryName} doesn&apos;t have live curiosities right now. Try another category on
        Discover, or spin a random topic from home.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={ROUTES.discover}
          className={cn(
            buttonVariants(),
            "w-full bg-kuriosa-deep-purple hover:bg-kuriosa-deep-purple/90 sm:w-auto"
          )}
        >
          Back to Discover
        </Link>
        <Link
          href={ROUTES.home}
          className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
        >
          Home
        </Link>
      </div>
    </div>
  );
}
