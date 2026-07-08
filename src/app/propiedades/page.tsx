import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PropertyCard } from "@/components/PropertyCard";
import { prisma } from "@/lib/prisma";
import { PROPERTY_TYPE_LABELS } from "@/lib/constants";
import { propertyTypeSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

type SearchParams = {
  tipo?: string;
  comuna?: string;
};

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tipo, comuna } = await searchParams;
  const parsedTipo = propertyTypeSchema.safeParse(tipo);

  const properties = await prisma.property.findMany({
    where: {
      estado: "disponible",
      ...(parsedTipo.success ? { tipo: parsedTipo.data } : {}),
      ...(comuna ? { comuna: { contains: comuna } } : {}),
    },
    include: { imagenes: { orderBy: { orden: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-semibold text-neutral-900">Propiedades</h1>

        <form className="mt-4 flex flex-wrap gap-3" method="get">
          <select name="tipo" defaultValue={tipo ?? ""} className="input max-w-xs">
            <option value="">Todas las líneas</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="comuna"
            defaultValue={comuna ?? ""}
            placeholder="Comuna"
            className="input max-w-xs"
          />
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Buscar
          </button>
        </form>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        {properties.length === 0 && (
          <p className="mt-10 text-center text-neutral-400">
            No hay propiedades disponibles con esos filtros.
          </p>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
