import { notFound, redirect } from "next/navigation";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { ROUTES } from "@/lib/constants/routes";
import { getCurrentUser } from "@/lib/services/user/auth";
import { assertInternalContentWorkflowAllowed } from "@/lib/services/internal/internal-content-workflow-guard";
import { loadCuriosityPreviewBySlug } from "@/lib/services/content/load-curiosity-preview";

interface InternalContentPreviewPageProps {
  params: Promise<{ slug: string }>;
}

function Section({ title, children }: { title: string; children: any }) {
  return (
    <section style={{ marginTop: 16 }}>
      <h2 style={{ fontWeight: 700 }}>{title}</h2>
      <div style={{ marginTop: 8 }}>{children}</div>
    </section>
  );
}

function renderExcerpt(text: string, maxChars: number) {
  const s = text.trim();
  if (s.length <= maxChars) return s;
  return `${s.slice(0, maxChars)}…`;
}

function getReviewStatus(exp: LoadedCuriosityExperience): string {
  return exp.moderation?.reviewStatus ?? "draft";
}

export default async function InternalContentPreviewPage({
  params,
}: InternalContentPreviewPageProps) {
  const { slug } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect(
      `${ROUTES.signIn}?redirect=${encodeURIComponent(
        `/internal/content-preview/${slug}`
      )}`
    );
  }

  try {
    assertInternalContentWorkflowAllowed(user.email);
  } catch {
    notFound();
  }

  const exp = await loadCuriosityPreviewBySlug(slug);
  if (!exp) notFound();

  const reviewStatus = getReviewStatus(exp);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>
        Internal Content Preview
      </h1>
      <p style={{ color: "#444" }}>
        Slug: <code>{slug}</code> • status: <code>{reviewStatus}</code>
      </p>

      <Section title="Discovery Card">
        <div>
          <div>
            Hook: <strong>{exp.discoveryCard.hookQuestion}</strong>
          </div>
          <div>Summary: {exp.discoveryCard.shortSummary}</div>
          <div>Estimated minutes: {exp.discoveryCard.estimatedMinutes}</div>
        </div>
      </Section>

      <Section title="Lesson">
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#f6f6f6",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {renderExcerpt(exp.lesson.lessonText, 1000)}
        </pre>
      </Section>

      <Section title="Challenge">
        {exp.challenge ? (
          <div>
            <div>
              Question: <strong>{exp.challenge.questionText}</strong>
            </div>
            <div>Quiz type: {exp.challenge.quizType}</div>
            <div style={{ marginTop: 8 }}>
              Options:{" "}
              {exp.challenge.options.map((o, i) => (
                <div key={`${o.optionText}-${i}`}>
                  - {o.optionText} {o.isCorrect ? "(correct)" : ""}
                </div>
              ))}
            </div>
            {exp.challenge.explanationText ? (
              <div style={{ marginTop: 8 }}>
                Explanation:{" "}
                <span>{renderExcerpt(exp.challenge.explanationText, 600)}</span>
              </div>
            ) : null}
          </div>
        ) : (
          <div>(no quiz rows yet)</div>
        )}
      </Section>

      <Section title="Follow-ups">
        {exp.followups.length === 0 ? (
          <div>(none)</div>
        ) : (
          exp.followups.map((f) => (
            <div key={f.id} style={{ marginTop: 8 }}>
              <div>
                Q: <strong>{f.questionText}</strong>
              </div>
              <div>
                A: {f.answerText ? renderExcerpt(f.answerText, 260) : "(none)"}
              </div>
            </div>
          ))
        )}
      </Section>

      <Section title="Trails">
        {exp.trails.length === 0 ? (
          <div>(none)</div>
        ) : (
          exp.trails.map((t) => (
            <div key={`${t.toTopicSlug}-${t.sortOrder}`} style={{ marginTop: 8 }}>
              <div>
                {t.sortOrder}. {t.toTopicTitle} (<code>{t.toTopicSlug}</code>)
              </div>
              <div>{renderExcerpt(t.reasonText, 220)}</div>
            </div>
          ))
        )}
      </Section>

      <Section title="Moderation & Source">
        <div>
          <div>
            reviewStatus: <code>{exp.moderation?.reviewStatus ?? "draft"}</code>
          </div>
          <div>
            sourceType: <code>{exp.analytics?.sourceType ?? "ai_generated"}</code>
          </div>
          <div>
            safetyFlags:{" "}
            <code>{(exp.moderation?.safetyFlags ?? []).join(", ") || "(empty)"}</code>
          </div>
        </div>
      </Section>

      <Section title="Workflow Actions (Internal Only)">
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {reviewStatus !== "reviewed" ? (
            <form method="post" action={`/api/internal/content-preview/${slug}/reviewed`}>
              <button type="submit">Mark Reviewed</button>
            </form>
          ) : null}
          {reviewStatus !== "published" ? (
            <form method="post" action={`/api/internal/content-preview/${slug}/published`}>
              <button type="submit">Publish</button>
            </form>
          ) : null}
          {reviewStatus !== "rejected" ? (
            <form method="post" action={`/api/internal/content-preview/${slug}/rejected`}>
              <button type="submit">Reject</button>
            </form>
          ) : null}
          {reviewStatus !== "archived" ? (
            <form method="post" action={`/api/internal/content-preview/${slug}/archived`}>
              <button type="submit">Archive</button>
            </form>
          ) : null}
        </div>
      </Section>

      <p style={{ color: "#666", marginTop: 16 }}>
        Note: this page is internal-only and protected by{" "}
        <code>INTERNAL_CONTENT_WORKFLOW_ALLOWLIST_EMAILS</code>.
      </p>
    </main>
  );
}

