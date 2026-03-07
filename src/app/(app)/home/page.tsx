import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { SupabaseInitCheck } from "@/components/shared/supabase-init-check";

export default function HomePage() {
  return (
    <PageContainer>
      <SupabaseInitCheck />
      <PageHeader
        title="Home"
        description="Your daily curiosity and progress."
      />
      <Section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Kuriosa</CardTitle>
            <CardDescription>
              Discover something fascinating every day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Get Started</Button>
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
