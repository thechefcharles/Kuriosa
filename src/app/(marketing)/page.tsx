import Link from "next/link";
import { APP_NAME, TAGLINE, SHORT_DESCRIPTION } from "@/lib/constants/brand";
import { ROUTES } from "@/lib/constants/routes";

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900">{APP_NAME}</h1>
        <p className="mt-2 text-lg text-slate-600">{TAGLINE}</p>
        <p className="mt-4 text-slate-500">{SHORT_DESCRIPTION}</p>
        <Link
          href={ROUTES.home}
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Enter Kuriosa
        </Link>
      </div>
    </div>
  );
}
