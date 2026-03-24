import type { Metadata } from "next";
import { CuriosityExperienceScreen } from "@/components/curiosity/curiosity-experience-screen";
import { getCuriosityPageMetadata } from "@/lib/services/social/get-curiosity-page-metadata";

interface CuriosityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CuriosityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getCuriosityPageMetadata(slug);
  if (!meta) return { title: "Curiosity | Kuriosa" };
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function CuriosityPage({
  params,
}: CuriosityPageProps) {
  const { slug } = await params;
  return <CuriosityExperienceScreen slug={slug} />;
}
