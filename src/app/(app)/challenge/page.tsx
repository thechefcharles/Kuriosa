"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChallengeScreen } from "@/components/challenge/challenge-screen";
import { PageContainer } from "@/components/shared/page-container";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mobile-safe entry: `/challenge?slug=…`. Pretty `/challenge/[slug]` unchanged for web.
 */
function ChallengeQueryContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() ?? "";

  if (!slug) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Add a topic slug to the URL, e.g.{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">?slug=your-topic</code>.
        </p>
        <Link href={ROUTES.discover} className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Go to Discover
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/90 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="pb-12 pt-6 sm:pt-8">
        <ChallengeScreen slug={slug} />
      </PageContainer>
    </div>
  );
}

export default function ChallengeQueryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <ChallengeQueryContent />
    </Suspense>
  );
}
