interface CuriosityPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CuriosityPage({ params }: CuriosityPageProps) {
  const { slug } = await params;

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-semibold text-slate-900">Curiosity</h1>
      <p className="mt-2 text-slate-600">Topic: {slug}</p>
    </div>
  );
}
