import Link from "next/link";
import { APP_NAME } from "@/lib/constants/brand";
import { ROUTES } from "@/lib/constants/routes";
import { AuthStatus } from "@/components/shared/auth-status";

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.home}
          className="text-lg font-semibold text-slate-900 no-underline"
        >
          {APP_NAME}
        </Link>
        <AuthStatus />
      </div>
    </header>
  );
}
