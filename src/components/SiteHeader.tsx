import Link from "next/link";
import { SocialLinks } from "@/components/SocialLinks";
import { SITE_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-stone-900">
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-sm text-stone-600">
            <Link href="/propiedades" className="hover:text-amber-700">
              Propiedades
            </Link>
            <Link href="/admin/login" className="hover:text-amber-700">
              Acceso socios
            </Link>
          </nav>
          <SocialLinks />
        </div>
      </div>
    </header>
  );
}
