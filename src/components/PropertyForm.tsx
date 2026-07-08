"use client";

import { useActionState } from "react";
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  CHILE_REGIONS,
} from "@/lib/constants";
import type { PropertyFormState } from "@/app/admin/propiedades/actions";

type PropertyDefaults = {
  tipo?: string;
  titulo?: string;
  descripcion?: string;
  direccion?: string;
  comuna?: string;
  region?: string;
  precio?: number;
  estado?: string;
};

export function PropertyForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (
    prevState: PropertyFormState,
    formData: FormData
  ) => Promise<PropertyFormState>;
  defaults?: PropertyDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Tipo de propiedad" error={state.fieldErrors?.tipo}>
          <select
            name="tipo"
            defaultValue={defaults?.tipo ?? ""}
            required
            className="input"
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Estado" error={state.fieldErrors?.estado}>
          <select
            name="estado"
            defaultValue={defaults?.estado ?? "disponible"}
            required
            className="input"
          >
            {Object.entries(PROPERTY_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Título" error={state.fieldErrors?.titulo}>
        <input
          name="titulo"
          type="text"
          defaultValue={defaults?.titulo}
          required
          maxLength={150}
          className="input"
          placeholder="Casa 3D/2B en Los Ángeles, sector centro"
        />
      </Field>

      <Field label="Descripción" error={state.fieldErrors?.descripcion}>
        <textarea
          name="descripcion"
          defaultValue={defaults?.descripcion}
          required
          rows={5}
          className="input"
          placeholder="Detalle de la propiedad, características, superficie, etc."
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Dirección" error={state.fieldErrors?.direccion}>
          <input
            name="direccion"
            type="text"
            defaultValue={defaults?.direccion}
            required
            className="input"
          />
        </Field>

        <Field label="Comuna" error={state.fieldErrors?.comuna}>
          <input
            name="comuna"
            type="text"
            defaultValue={defaults?.comuna}
            required
            className="input"
          />
        </Field>

        <Field label="Región" error={state.fieldErrors?.region}>
          <select
            name="region"
            defaultValue={defaults?.region ?? ""}
            required
            className="input"
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {CHILE_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Precio (CLP)" error={state.fieldErrors?.precio}>
        <input
          name="precio"
          type="number"
          min={1}
          step={1}
          defaultValue={defaults?.precio}
          required
          className="input max-w-xs"
        />
      </Field>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {pending ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
