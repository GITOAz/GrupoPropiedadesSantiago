import Link from "next/link";
import { getSession } from "@/lib/auth";
import { SITE_NAME } from "@/lib/constants";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // La ruta /admin/login no pasa por este layout con sesión activa,
  // pero puede renderizarse sin sesión (el middleware la deja pasar).
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin/propiedades" className="font-semibold text-neutral-900">
              {SITE_NAME} — Admin
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link
                href="/admin/propiedades"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Propiedades
              </Link>
              <Link
                href="/admin/propiedades/nueva"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Nueva propiedad
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-neutral-500">{session.nombre}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-neutral-700 hover:bg-neutral-100"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
