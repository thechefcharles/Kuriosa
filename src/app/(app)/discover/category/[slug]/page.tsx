import Link from "next/link";
import { PageContainer } from "@/components/shared/page-container";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Placeholder for Phase 7.3 — full category browse (topic grid, filters).
 * Linked from Discover so navigation is stable.
 */
export default async function DiscoverCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const label = decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <PageContainer className="py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-kuriosa-electric-cyan">
        Category
      </p>
      <h1 className="mt-2 text-2xl font-bold text-kuriosa-midnight-blue dark:text-white">
        {label}
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Full topic browsing for this category arrives in{" "}
        <strong className="text-foreground">Phase 7.3</strong>. For now, open Discover or spin a
        random curiosity.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={ROUTES.discover} className={cn(buttonVariants({ variant: "default" }))}>
          Back to Discover
        </Link>
        <Link href={ROUTES.home} className={cn(buttonVariants({ variant: "outline" }))}>
          Home
        </Link>
      </div>
    </PageContainer>
  );
}
