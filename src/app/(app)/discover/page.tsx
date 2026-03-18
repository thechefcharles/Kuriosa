"use client";

/**
 * Temporary Phase 5.1 dev surface: verifies daily + random curiosity hooks.
 * Replace with real Discover UI in a later prompt.
 */

import { useDailyCuriosity } from "@/hooks/queries/useDailyCuriosity";
import { useRandomCuriosity } from "@/hooks/queries/useRandomCuriosity";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { curiosityQueryKeys } from "@/lib/query/query-keys";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import { cn } from "@/lib/utils";

export default function DiscoverPage() {
  const queryClient = useQueryClient();
  const daily = useDailyCuriosity();
  const random = useRandomCuriosity();

  const spinAnother = () => {
    void queryClient.invalidateQueries({
      queryKey: curiosityQueryKeys.random(undefined, undefined),
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Discover"
        description="Feed your curiosity — explore topics and trails."
      />

      <div className="mb-2 rounded-md border border-violet-200/80 bg-violet-50/80 px-3 py-2 text-xs text-violet-900 dark:border-violet-900/40 dark:bg-violet-950/30 dark:text-violet-100">
        Discover preview — open a topic below to run the full loop (lesson → challenge →
        exploration).
      </div>

      <section className="mt-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Daily curiosity
        </h2>
        {daily.isLoading ? (
          <LoadingState />
        ) : daily.isError ? (
          <ErrorState message={daily.error.message} />
        ) : !daily.data ? (
          <EmptyState
            title="No daily curiosity"
            description="No row in daily_curiosity for today (UTC). Add one in Supabase or seed data."
          />
        ) : (
          <DebugExperience
            title={daily.data.experience.identity.title}
            slug={daily.data.experience.identity.slug}
            category={daily.data.experience.taxonomy.category}
            extra={`theme: ${daily.data.theme ?? "—"} · date: ${daily.data.date}`}
          />
        )}
      </section>

      <section className="mt-10 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Random curiosity
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={spinAnother}>
            Pick another
          </Button>
        </div>
        {random.isLoading ? (
          <LoadingState />
        ) : random.isError ? (
          <ErrorState message={random.error.message} />
        ) : !random.data ? (
          <EmptyState
            title="No published topics"
            description="Publish at least one topic (status = published) to test random load."
          />
        ) : (
          <DebugExperience
            title={random.data.identity.title}
            slug={random.data.identity.slug}
            category={random.data.taxonomy.category}
            extra={
              random.data.challenge
                ? "has challenge"
                : "no quiz yet (challenge omitted)"
            }
          />
        )}
      </section>
    </PageContainer>
  );
}

function DebugExperience({
  title,
  slug,
  category,
  extra,
}: {
  title: string;
  slug: string;
  category: string;
  extra?: string;
}) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3 text-sm shadow-sm">
      <div>
        <span className="text-muted-foreground">title: </span>
        <span className="font-medium">{title}</span>
      </div>
      <div>
        <span className="text-muted-foreground">slug: </span>
        <code className="text-xs">{slug}</code>
      </div>
      <div>
        <span className="text-muted-foreground">category: </span>
        {category}
      </div>
      {extra ? (
        <div className="mt-1 text-xs text-muted-foreground">{extra}</div>
      ) : null}
      <Link
        href={ROUTES.curiosity(slug)}
        onClick={() =>
          setTopicDiscoveryContext(slug, {
            wasDailyFeature: false,
            wasRandomSpin: false,
          })
        }
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-3 w-full sm:w-auto"
        )}
      >
        Open curiosity
      </Link>
    </div>
  );
}
