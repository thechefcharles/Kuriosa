"use client";

import { useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shareTopic } from "@/lib/services/social/share-topic-client";
import type { TopicShareMetadataInput } from "@/lib/services/social/get-topic-share-metadata";
import { cn } from "@/lib/utils";

export type ShareTopicButtonProps = {
  topicId: string;
  slug: string;
  title: string;
  hookQuestion?: string | null;
  shortSummary?: string | null;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
};

export function ShareTopicButton({
  topicId,
  slug,
  title,
  hookQuestion,
  shortSummary,
  variant = "outline",
  size = "default",
  className,
  children,
}: ShareTopicButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleShare = async () => {
    setStatus("loading");
    setMessage(null);

    const result = await shareTopic({
      topicId,
      slug,
      title,
      hookQuestion,
      shortSummary,
    });

    if (result.ok) {
      setStatus("success");
      setMessage(result.channel === "native_share" ? "Shared!" : "Link copied!");
      setTimeout(() => {
        setStatus("idle");
        setMessage(null);
      }, 2000);
    } else {
      setStatus("error");
      setMessage(result.error || "Could not share");
      setTimeout(() => {
        setStatus("idle");
        setMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleShare}
        disabled={status === "loading"}
        className={cn("gap-2", className)}
        aria-label="Share this curiosity"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : status === "success" ? (
          <Check className="h-4 w-4 text-green-600 dark:text-green-500" aria-hidden />
        ) : (
          <Share2 className="h-4 w-4" aria-hidden />
        )}
        {children ?? "Share"}
      </Button>
      {message && (
        <span
          className={cn(
            "text-xs",
            status === "success" && "text-green-600 dark:text-green-500",
            status === "error" && "text-amber-600 dark:text-amber-500"
          )}
          role="status"
        >
          {message}
        </span>
      )}
    </div>
  );
}
