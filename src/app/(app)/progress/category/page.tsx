"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CategoryProgressScreen } from "@/components/progress/category-progress-screen";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mobile-safe entry: `/progress/category?slug=…`. Pretty `/progress/category/[slug]` unchanged.
 */
function ProgressCategoryQueryContent() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("slug")?.trim() ?? "";
  const slug = raw ? decodeURIComponent(raw) : "";

  if (!slug) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Add a category slug, e.g.{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">?slug=science</code>.
        </p>
        <Link href={ROUTES.progress} className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Back to Progress
        </Link>
      </div>
    );
  }

  return <CategoryProgressScreen slug={slug} />;
}

export default function ProgressCategoryQueryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <ProgressCategoryQueryContent />
    </Suspense>
  );
}
