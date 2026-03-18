import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChallengeTopicMissing() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <EmptyState
        title="Curiosity not found"
        description="We couldn’t load this topic. Check the link or pick another curiosity."
        className="rounded-2xl px-6 py-10"
      />
      <div className="flex justify-center">
        <Link href={ROUTES.home} className={cn(buttonVariants({ size: "lg" }))}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
