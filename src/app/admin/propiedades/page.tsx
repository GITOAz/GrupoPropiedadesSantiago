import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  CLP_FORMATTER,
} from "@/lib/constants";
import { DeletePropertyButton } from "@/components/DeletePropertyButton";
import { propertyTypeSchema, propertyStatusSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function AdminPropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; estado?: string }>;
}) {
  const { tipo, estado } = await searchParams;
  const parsedTipo = propertyTypeSchema.safeParse(tipo);
  const parsedEstado = propertyStatusSchema.safeParse(estado);

  const properties = await prisma.property.findMany({
    where: {
      ...(parsedTipo.success ? { tipo: parsedTipo.data } : {}),
      ...(parsedEstado.success ? { estado: parsedEstado.data } : {}),
    },
    include: { _count: { select: { imagenes: true, videos: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Propiedades</h1>
        <Link
          href="/admin/propiedades/nueva"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Nueva propiedad
        </Link>
      </div>

      <form className="mt-4 flex flex-wrap gap-3" method="get">
        <select name="tipo" defaultValue={tipo ?? ""} className="input max-w-xs">
          <option value="">Todas las líneas</option>
          {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select name="estado" defaultValue={estado ?? ""} className="input max-w-xs">
          <option value="">Todos los estados</option>
          {Object.entries(PROPERTY_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
        >
          Filtrar
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Comuna</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Media</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {p.titulo}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {PROPERTY_TYPE_LABELS[p.tipo]}
                </td>
                <td className="px-4 py-3 text-neutral-600">{p.comuna}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {CLP_FORMATTER.format(p.precio)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                    {PROPERTY_STATUS_LABELS[p.estado]}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {p._count.imagenes} fotos · {p._count.videos} videos
                </td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <Link
                    href={`/admin/propiedades/${p.id}/editar`}
                    className="text-neutral-700 underline hover:text-neutral-900"
                  >
                    Editar
                  </Link>
                  <DeletePropertyButton propertyId={p.id} />
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                  No hay propiedades cargadas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
