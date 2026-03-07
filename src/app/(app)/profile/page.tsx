import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";

export default function ProfilePage() {
  return (
    <PageContainer>
      <PageHeader title="Profile" description="Account and settings." />
      <Section className="mt-6">
        <p className="text-sm text-muted-foreground">
          Analytics foundation installed. Monitoring foundation installed.
        </p>
      </Section>
    </PageContainer>
  );
}
