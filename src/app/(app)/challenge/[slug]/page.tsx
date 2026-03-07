interface ChallengePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-semibold text-slate-900">Challenge</h1>
      <p className="mt-2 text-slate-600">Quiz for topic: {slug}</p>
    </div>
  );
}
