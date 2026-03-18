import Link from "next/link";
import type { CategoryView } from "@/types/discovery";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";

export function CategoryCard({
  category,
  href,
  className,
}: {
  category: CategoryView;
  /** When omitted, renders a non-link card (7.2 will pass category route). */
  href?: string;
  className?: string;
}) {
  const count =
    typeof category.topicCount === "number" ? category.topicCount : null;
  const desc = category.description?.trim();

  const body = (
    <>
      <div className="flex items-center gap-2">
        <FolderOpen
          className="h-5 w-5 shrink-0 text-kuriosa-electric-cyan"
          aria-hidden
        />
        <h3 className="font-semibold text-kuriosa-midnight-blue dark:text-white">
          {category.name}
        </h3>
      </div>
      {count != null ? (
        <p className="mt-1 text-sm text-muted-foreground">
          {count} topic{count === 1 ? "" : "s"}
        </p>
      ) : null}
      {desc ? (
        <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{desc}</p>
      ) : null}
    </>
  );

  const cardClass = cn(
    "rounded-xl border border-slate-200/90 bg-white/90 p-4 shadow-sm transition-all",
    "dark:border-white/10 dark:bg-slate-900/60",
    href &&
      "cursor-pointer ring-offset-background hover:border-kuriosa-deep-purple/40 hover:shadow-md hover:ring-1 hover:ring-kuriosa-electric-cyan/30 active:scale-[0.99] dark:hover:border-kuriosa-electric-cyan/30",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          cardClass,
          "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuriosa-electric-cyan"
        )}
      >
        {body}
      </Link>
    );
  }

  return <div className={cardClass}>{body}</div>;
}
