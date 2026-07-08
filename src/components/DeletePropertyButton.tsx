"use client";

import { useTransition } from "react";
import { deletePropertyAction } from "@/app/admin/propiedades/actions";

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("¿Eliminar esta propiedad y todas sus fotos/videos?")) return;
        startTransition(() => {
          deletePropertyAction(propertyId);
        });
      }}
      className="text-red-600 underline hover:text-red-800 disabled:opacity-50"
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}
