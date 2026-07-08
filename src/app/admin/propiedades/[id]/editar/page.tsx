import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/PropertyForm";
import { MediaManager } from "@/components/MediaManager";
import { updatePropertyAction } from "@/app/admin/propiedades/actions";

export const dynamic = "force-dynamic";

export default async function EditarPropiedadPage({
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

  const boundUpdate = updatePropertyAction.bind(null, property.id);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/propiedades" className="text-sm text-neutral-500 hover:underline">
        ← Volver al listado
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
        Editar propiedad
      </h1>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">
        <PropertyForm
          action={boundUpdate}
          defaults={property}
          submitLabel="Guardar cambios"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900">
          Fotos y videos
        </h2>
        <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-6">
          <MediaManager
            propertyId={property.id}
            imagenes={property.imagenes}
            videos={property.videos}
          />
        </div>
      </div>
    </div>
  );
}
