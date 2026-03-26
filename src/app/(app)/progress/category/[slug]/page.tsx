import { CategoryProgressScreen } from "@/components/progress/category-progress-screen";

export default async function ProgressCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryProgressScreen slug={decodeURIComponent(slug)} />;
}
