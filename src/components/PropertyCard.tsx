import Link from "next/link";
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  CLP_FORMATTER,
} from "@/lib/constants";

type CardProperty = {
  id: string;
  tipo: string;
  titulo: string;
  comuna: string;
  region: string;
  precio: number;
  estado: string;
  imagenes: { url: string }[];
};

export function PropertyCard({ property }: { property: CardProperty }) {
  const cover = property.imagenes[0]?.url;

  return (
    <Link
      href={`/propiedades/${property.id}`}
      className="group block overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={property.titulo}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            Sin fotos
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
            {PROPERTY_TYPE_LABELS[property.tipo]}
          </span>
          {property.estado !== "disponible" && (
            <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-medium uppercase text-white">
              {PROPERTY_STATUS_LABELS[property.estado]}
            </span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-2 font-medium text-stone-900">
          {property.titulo}
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          {property.comuna}, {property.region}
        </p>
        <p className="mt-2 text-lg font-semibold text-stone-900">
          {CLP_FORMATTER.format(property.precio)}
        </p>
      </div>
    </Link>
  );
}
