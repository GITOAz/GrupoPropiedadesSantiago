import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactForm } from "@/components/ContactForm";
import { prisma } from "@/lib/prisma";
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  CLP_FORMATTER,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      imagenes: { orderBy: { orden: "asc" } },
      videos: { orderBy: { orden: "asc" } },
    },
  });

  if (!property) notFound();

  const propertyLabel = `${property.id} — ${property.titulo}`;

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <Link href="/" className="text-sm text-stone-500 hover:underline">
          ← Volver
        </Link>
        <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Gallery
              imagenes={property.imagenes}
              videos={property.videos}
              titulo={property.titulo}
            />

            <div className="mt-6">
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {PROPERTY_TYPE_LABELS[property.tipo]}
              </span>
              <h1 className="mt-1 text-2xl font-semibold text-neutral-900">
                {property.titulo}
              </h1>
              <p className="mt-1 text-neutral-500">
                {property.direccion}, {property.comuna}, {property.region}
              </p>
              <p className="mt-3 text-2xl font-semibold text-neutral-900">
                {CLP_FORMATTER.format(property.precio)}
              </p>
              {property.estado !== "disponible" && (
                <span className="mt-2 inline-block rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium uppercase text-white">
                  {PROPERTY_STATUS_LABELS[property.estado]}
                </span>
              )}

              <p className="mt-6 whitespace-pre-line text-neutral-700">
                {property.descripcion}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Contactar por esta propiedad
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Te contactaremos apenas revisemos tu solicitud.
            </p>
            <div className="mt-4">
              <ContactForm propertyId={property.id} propertyLabel={propertyLabel} />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Gallery({
  imagenes,
  videos,
  titulo,
}: {
  imagenes: { id: string; url: string }[];
  videos: { id: string; url: string }[];
  titulo: string;
}) {
  if (imagenes.length === 0 && videos.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
        Sin fotos ni videos todavía
      </div>
    );
  }

  const [first, ...rest] = imagenes;

  return (
    <div>
      {first && (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={first.url} alt={titulo} className="h-full w-full object-cover" />
        </div>
      )}
      {(rest.length > 0 || videos.length > 0) && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {rest.map((img) => (
            <div key={img.id} className="aspect-square overflow-hidden rounded-md bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={titulo} className="h-full w-full object-cover" />
            </div>
          ))}
          {videos.map((vid) => (
            <div key={vid.id} className="aspect-square overflow-hidden rounded-md bg-neutral-900">
              <video src={vid.url} controls className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
