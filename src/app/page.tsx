import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PropertyCard } from "@/components/PropertyCard";
import { prisma } from "@/lib/prisma";
import { CONTACT_DISPLAY_EMAIL, SITE_NAME } from "@/lib/constants";
import { BUSINESS_LINES, VALUE_PROPS, HERO_IMAGE } from "@/lib/landing-content";
import { ICONS } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const destacadas = await prisma.property.findMany({
    where: { estado: "disponible" },
    include: { imagenes: { orderBy: { orden: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="flex min-h-full flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="overflow-hidden bg-gradient-to-b from-amber-50 via-white to-white">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-14 sm:py-20 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                {SITE_NAME}
              </span>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl">
                Encuentra un lugar para llamar hogar
              </h1>
              <p className="mt-4 max-w-md text-lg text-stone-600">
                Casas, departamentos, bodegas y estacionamientos — nuevos y
                usados. Te acompañamos de cerca, desde la primera visita
                hasta que tengas las llaves en la mano.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/propiedades"
                  className="rounded-md bg-amber-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-800"
                >
                  Ver propiedades
                </Link>
                <a
                  href={`mailto:${CONTACT_DISPLAY_EMAIL}`}
                  className="rounded-md border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400"
                >
                  Quiero comprar, arrendar o vender
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-amber-200/40 blur-2xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMAGE}
                alt="Entrega de llaves de un nuevo hogar"
                className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* ── Líneas de negocio ────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
              Nuestras líneas de negocio
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-stone-600">
              Seis formas de encontrar tu próximo espacio, todas bajo un
              mismo equipo de confianza.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BUSINESS_LINES.map((linea) => (
              <Link
                key={linea.tipo}
                href={`/propiedades?tipo=${linea.tipo}`}
                className="group block overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={linea.imagen}
                    alt={linea.titulo}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-stone-900">{linea.titulo}</h3>
                  <p className="mt-1 text-sm text-stone-600">{linea.descripcion}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-amber-700 group-hover:underline">
                    Ver disponibles →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Por qué elegirnos ────────────────────────────────── */}
        <section className="bg-stone-50 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
                ¿Por qué elegirnos?
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-stone-600">
                Somos un equipo afiatado y cercano — eso significa atención
                directa, sin vueltas.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUE_PROPS.map((prop) => {
                const Icon = ICONS[prop.icon];
                return (
                  <div
                    key={prop.titulo}
                    className="rounded-xl border border-stone-200 bg-white p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold text-stone-900">
                      {prop.titulo}
                    </h3>
                    <p className="mt-1.5 text-sm text-stone-600">
                      {prop.descripcion}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Propiedades destacadas ───────────────────────────── */}
        {destacadas.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
                Publicadas recientemente
              </h2>
              <Link href="/propiedades" className="text-sm font-medium text-amber-700 hover:underline">
                Ver todas →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {destacadas.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}

        {/* ── CTA final ─────────────────────────────────────────── */}
        <section className="bg-amber-800">
          <div className="mx-auto max-w-6xl px-4 py-14 text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              ¿Tienes una propiedad para vender o arrendar?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-amber-100">
              Conversemos sin compromiso. Escríbenos a{" "}
              <a href={`mailto:${CONTACT_DISPLAY_EMAIL}`} className="underline">
                {CONTACT_DISPLAY_EMAIL}
              </a>{" "}
              y te contactamos a la brevedad.
            </p>
            <Link
              href="/propiedades"
              className="mt-6 inline-block rounded-md bg-white px-6 py-3 text-sm font-medium text-amber-800 transition hover:bg-amber-50"
            >
              Ver propiedades disponibles
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
