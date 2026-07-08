"use client";

import { useState, type FormEvent } from "react";
import { COUNTRY_CODES } from "@/lib/constants";

export function ContactForm({
  propertyId,
  propertyLabel,
}: {
  propertyId: string;
  propertyLabel: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setErrorMsg(null);

    const formData = new FormData(form);
    const payload = {
      propertyId,
      nombreCompleto: String(formData.get("nombreCompleto") || ""),
      email: String(formData.get("email") || ""),
      whatsappCodigo: String(formData.get("whatsappCodigo") || ""),
      whatsappNumero: String(formData.get("whatsappNumero") || ""),
      comentario: String(formData.get("comentario") || ""),
      fechaVisita: String(formData.get("fechaVisita") || ""),
      franjaHoraria: String(formData.get("franjaHoraria") || ""),
    };

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "No se pudo enviar el formulario.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("No se pudo conectar con el servidor.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        ¡Gracias! Recibimos tu solicitud de contacto para esta propiedad.
        Te responderemos a la brevedad.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <span className="block text-sm font-medium text-neutral-700">
          Propiedad
        </span>
        <input
          type="text"
          value={propertyLabel}
          readOnly
          disabled
          className="input mt-1 bg-neutral-100 text-neutral-500"
        />
      </div>

      <div>
        <label htmlFor="nombreCompleto" className="block text-sm font-medium text-neutral-700">
          Nombre completo
        </label>
        <input
          id="nombreCompleto"
          name="nombreCompleto"
          type="text"
          required
          className="input mt-1"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
          Email
        </label>
        <input id="email" name="email" type="email" required className="input mt-1" />
      </div>

      <div>
        <span className="block text-sm font-medium text-neutral-700">WhatsApp</span>
        <div className="mt-1 flex gap-2">
          <select name="whatsappCodigo" defaultValue="+56" className="input w-32">
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            name="whatsappNumero"
            type="tel"
            required
            pattern="[0-9]{8,12}"
            title="Solo dígitos, entre 8 y 12 números"
            placeholder="912345678"
            className="input flex-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fechaVisita" className="block text-sm font-medium text-neutral-700">
            Fecha sugerida de visita
          </label>
          <input
            id="fechaVisita"
            name="fechaVisita"
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            className="input mt-1"
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-neutral-700">Franja horaria</span>
          <div className="mt-2 flex gap-4 text-sm">
            <label className="flex items-center gap-1.5">
              <input type="radio" name="franjaHoraria" value="manana" required />
              Mañana
            </label>
            <label className="flex items-center gap-1.5">
              <input type="radio" name="franjaHoraria" value="tarde" />
              Tarde
            </label>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="comentario" className="block text-sm font-medium text-neutral-700">
          Comentario (opcional)
        </label>
        <textarea id="comentario" name="comentario" rows={3} className="input mt-1" />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {status === "loading" ? "Enviando…" : "Enviar contacto"}
      </button>
    </form>
  );
}
