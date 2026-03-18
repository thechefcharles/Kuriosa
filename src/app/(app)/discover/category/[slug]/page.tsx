import { CategoryScreen } from "@/components/discovery/category-screen";

export default async function DiscoverCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryScreen slug={decodeURIComponent(slug)} />;
}
