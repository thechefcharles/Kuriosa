import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export function DiscoverySectionHeader({
  title,
  description,
  cta,
  className,
}: {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1 sm:mb-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h2 className="text-lg font-bold tracking-tight text-kuriosa-midnight-blue dark:text-white sm:text-xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {cta ? (
        <Link
          href={cta.href}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-kuriosa-electric-cyan hover:underline sm:mt-0"
        >
          {cta.label}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
