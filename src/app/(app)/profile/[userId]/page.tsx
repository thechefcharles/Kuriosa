import { PublicProfileLayout } from "@/components/social/public-profile-layout";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;

  return <PublicProfileLayout userId={userId} />;
}
