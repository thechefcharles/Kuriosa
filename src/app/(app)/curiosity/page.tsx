"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CuriosityExperienceScreen } from "@/components/curiosity/curiosity-experience-screen";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mobile-safe entry: `/curiosity?slug=…` (finite path for static export).
 * Pretty `/curiosity/[slug]` remains the primary web URL.
 */
function CuriosityQueryContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() ?? "";
  const fromDiscover = searchParams.get("from") === "discover";

  if (!slug) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Open a topic from Discover, or use a link that includes{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">?slug=</code>.
        </p>
        <Link href={ROUTES.discover} className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Go to Discover
        </Link>
      </div>
    );
  }

  return <CuriosityExperienceScreen slug={slug} fromDiscover={fromDiscover} />;
}

export default function CuriosityQueryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <CuriosityQueryContent />
    </Suspense>
  );
}
