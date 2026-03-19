interface CuriosityPageProps {
  params: Promise<{ slug: string }>;
}

import { CuriosityExperienceScreen } from "@/components/curiosity/curiosity-experience-screen";

export default async function CuriosityPage({
  params,
}: CuriosityPageProps) {
  const { slug } = await params;
  return <CuriosityExperienceScreen slug={slug} />;
}
