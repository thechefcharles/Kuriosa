"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useGuidedTopicExploration } from "@/hooks/queries/useGuidedTopicExploration";
import { useAskManualQuestion } from "@/hooks/mutations/useAskManualQuestion";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import { AIFollowupSection } from "./ai-followup-section";
import { ManualQuestionBox } from "./manual-question-box";
import { AIAnswerCard } from "./ai-answer-card";
import { AIAnswerLoading } from "./ai-answer-loading";
import { AIAnswerError } from "./ai-answer-error";
import { RabbitHoleSection } from "./rabbit-hole-section";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import type { ManualQuestionResult } from "@/types/ai";
import type { TopicRabbitHoleItem } from "@/types/ai";
import { cn } from "@/lib/utils";

export function AIExplorationBlock({
  slug,
  topicId,
  topicTitle,
}: {
  slug: string;
  topicId: string;
  topicTitle: string;
}) {
  const { data: userId } = useAuthUserId();
  const { data, isLoading, isError, error } = useGuidedTopicExploration({
    slug,
    topicId,
  });
  const askQuestion = useAskManualQuestion();

  const [manualAnswer, setManualAnswer] = useState<{
    question: string;
    result: ManualQuestionResult;
  } | null>(null);

  const requireAuth = !userId;
  const handleAuthRequired = () => {
    const redirect = `${window.location.pathname}${window.location.hash || "#whats-next"}`;
    window.location.href = `${ROUTES.signIn}?redirect=${encodeURIComponent(redirect)}`;
  };

  const onManualSubmit = (question: string) => {
    setManualAnswer(null);
    askQuestion.mutate(
      { slug, topicId, questionText: question },
      {
        onSuccess: (result) => {
          setManualAnswer({ question, result });
        },
      }
    );
  };

  const onRabbitHoleSelect = (item: TopicRabbitHoleItem) => {
    setManualAnswer(null);
    const questionText = item.title;
    askQuestion.mutate(
      { slug, topicId, questionText },
      {
        onSuccess: (result) => {
          setManualAnswer({ question: questionText, result });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-violet-200/60 bg-violet-50/20 px-5 py-8 dark:border-white/10 dark:bg-violet-950/20">
        <Loader2 className="h-6 w-6 animate-spin text-kuriosa-electric-cyan" />
        <p className="text-sm text-muted-foreground">Loading AI suggestions…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-dashed border-violet-200/60 bg-violet-50/20 px-5 py-6 text-center dark:border-white/10 dark:bg-violet-950/20">
        <p className="text-sm text-muted-foreground">
          {error?.message ?? "Couldn't load AI exploration."}
        </p>
      </div>
    );
  }

  const hasFollowups = data.followups.length > 0;
  const hasRabbitHoles = data.rabbitHoles.length > 0;

  if (!hasFollowups && !hasRabbitHoles) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-200/70 pb-2 dark:border-white/10">
        <Sparkles className="h-5 w-5 text-kuriosa-electric-cyan" aria-hidden />
        <h3 className="text-sm font-bold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
          Go deeper with AI
        </h3>
      </div>

      {hasFollowups ? (
        <AIFollowupSection
          followups={data.followups}
          topicId={data.topicContext.topicId}
          slug={data.topicContext.slug}
          userId={userId ?? null}
        />
      ) : null}

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Ask something about this topic
        </p>
        <ManualQuestionBox
          onSubmit={onManualSubmit}
          disabled={requireAuth}
          isLoading={askQuestion.isPending}
          topicTitle={topicTitle}
          requireAuth={requireAuth}
          onAuthRequired={handleAuthRequired}
        />
      </div>

      {manualAnswer ? (
        <div className="space-y-4">
          {manualAnswer.result.ok ? (
            <AIAnswerCard
              question={manualAnswer.result.question}
              answerText={manualAnswer.result.answerText}
            />
          ) : (
            <AIAnswerError
              result={manualAnswer.result}
              onRetry={() =>
                askQuestion.mutate(
                  {
                    slug,
                    topicId,
                    questionText: manualAnswer.question,
                  },
                  {
                    onSuccess: (r) =>
                      setManualAnswer({
                        question: manualAnswer.question,
                        result: r,
                      }),
                  }
                )
              }
            />
          )}

          {hasRabbitHoles ? (
            <RabbitHoleSection
              rabbitHoles={data.rabbitHoles}
              onSelectRabbitHole={onRabbitHoleSelect}
            />
          ) : null}
        </div>
      ) : hasRabbitHoles && !manualAnswer ? (
        <RabbitHoleSection
          rabbitHoles={data.rabbitHoles}
          onSelectRabbitHole={onRabbitHoleSelect}
        />
      ) : null}
    </div>
  );
}
