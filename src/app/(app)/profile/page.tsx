import { redirect } from "next/navigation";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { getCurrentProfile } from "@/lib/services/user/auth";
import { getCategories } from "@/lib/services/categories";
import { getBadges } from "@/lib/services/badges";

export default async function ProfilePage() {
  const [profile, categories, badges] = await Promise.all([
    getCurrentProfile(),
    getCategories(),
    getBadges(),
  ]);

  if (!profile) redirect("/auth/sign-in");

  return (
    <PageContainer>
      <PageHeader title="Profile" description="Account and settings." />
      <Section className="mt-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Logged in. Profile and reference data loaded via RLS.
        </p>
        <div className="rounded-md border p-3 text-sm" data-testid="profile-verification">
          <p><strong>Verification (dev):</strong></p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-muted-foreground">
            <li>Profile ID: {profile.id.slice(0, 8)}…</li>
            <li>Categories loaded: {categories.length}</li>
            <li>Badges loaded: {badges.length}</li>
          </ul>
        </div>
      </Section>
    </PageContainer>
  );
}
