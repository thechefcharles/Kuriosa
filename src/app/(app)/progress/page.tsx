import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";

export default function ProgressPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Progress"
        description="XP, streaks, badges, and Curiosity Score."
      />
      <Section className="mt-6">
        <p className="text-sm text-muted-foreground">
          Phase 2 infrastructure ready: app scaffold, routes, design system,
          Supabase utilities, env setup, API foundation, observability, data layer.
        </p>
      </Section>
    </PageContainer>
  );
}
