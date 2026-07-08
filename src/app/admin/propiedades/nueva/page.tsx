import { PropertyForm } from "@/components/PropertyForm";
import { createPropertyAction } from "@/app/admin/propiedades/actions";

export default function NuevaPropiedadPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Nueva propiedad
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Después de guardar podrás subir fotos y videos.
      </p>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">
        <PropertyForm action={createPropertyAction} submitLabel="Crear propiedad" />
      </div>
    </div>
  );
}
