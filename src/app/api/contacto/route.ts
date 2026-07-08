import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactInputSchema } from "@/lib/validation";

/**
 * Recibe el formulario de contacto del sitio público.
 *
 * 1. Valida y guarda una copia local en ContactRequest (respaldo/depuración
 *    en Beta, ya que todavía no hay base de datos productiva).
 * 2. Si APPS_SCRIPT_WEBHOOK_URL está configurada, reenvía el payload al
 *    Web App de Google Apps Script, que es quien realmente escribe en la
 *    hoja "Pendientes" y dispara el correo de aprobación a los socios
 *    (ver /apps-script/Code.gs). Mientras esa variable esté vacía, el
 *    contacto queda solo registrado localmente.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = contactInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const property = await prisma.property.findUnique({
    where: { id: parsed.data.propertyId },
    select: { id: true, titulo: true },
  });

  if (!property) {
    return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }

  const webhookUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
  let forwarded = false;
  let forwardError: string | null = null;

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          propertyId: property.id,
          propertyTitulo: property.titulo,
        }),
      });
      forwarded = res.ok;
      if (!res.ok) forwardError = `Apps Script respondió ${res.status}`;
    } catch (err) {
      forwardError = err instanceof Error ? err.message : "Error desconocido";
    }
  }

  const contact = await prisma.contactRequest.create({
    data: {
      propertyId: parsed.data.propertyId,
      nombreCompleto: parsed.data.nombreCompleto,
      email: parsed.data.email,
      whatsappCodigo: parsed.data.whatsappCodigo,
      whatsappNumero: parsed.data.whatsappNumero,
      comentario: parsed.data.comentario || null,
      fechaVisita: new Date(parsed.data.fechaVisita),
      franjaHoraria: parsed.data.franjaHoraria,
      status: webhookUrl && !forwarded ? "error_envio" : "enviado",
    },
  });

  return NextResponse.json({
    ok: true,
    id: contact.id,
    forwardedToAppsScript: forwarded,
    ...(webhookUrl ? {} : { note: "Apps Script aún no configurado; contacto solo registrado localmente." }),
    ...(forwardError ? { forwardError } : {}),
  });
}
