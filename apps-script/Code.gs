/**
 * Grupo Propiedades Santiago — Flujo de aprobación de contactos (Beta)
 * ==============================================================
 *
 * Qué hace este script:
 *   1. Recibe (doPost) el formulario de contacto que el sitio Next.js
 *      reenvía desde /api/contacto.
 *   2. Escribe el registro en la hoja "Pendientes" de esta planilla.
 *   3. Envía un correo a los socios (desde la cuenta con la que se
 *      despliega este script) con el detalle del contacto y dos links:
 *      "Aprobar" y "Rechazar".
 *   4. Al hacer clic en un link (doGet), mueve el registro a "Aprobados"
 *      o lo marca como "Rechazado" en la misma hoja "Pendientes".
 *
 * No usa API keys: se autoriza con la cuenta personal de Google que
 * despliega el Web App (Extensiones > Apps Script, en una hoja de
 * cálculo de Google Sheets). El correo se envía con GmailApp desde esa
 * misma cuenta.
 *
 * INSTRUCCIONES DE DESPLIEGUE: ver apps-script/README.md
 */

// ─── Configuración ──────────────────────────────────────────────────

// Emails de los 3 socios que reciben la notificación y los links de
// aprobación/rechazo. Edita esta lista si cambia el equipo.
const SOCIOS_EMAILS = [
  "patricio@grupopropiedades.cl",
  "sergio@grupopropiedades.cl",
  "oscar.aranguiz.i@gmail.com",
];

// Nombre que aparece como remitente del correo (la cuenta real de envío
// sigue siendo la que autoriza este script).
const REMITENTE_NOMBRE = "Grupo Propiedades Santiago";

const HOJA_PENDIENTES = "Pendientes";
const HOJA_APROBADOS = "Aprobados";

// Encabezados de columnas, idénticos en Pendientes y Aprobados para que
// mover una fila entre hojas sea una simple copia de valores.
const COLUMNAS = [
  "ID",
  "Token",
  "Fecha registro",
  "Propiedad ID",
  "Propiedad título",
  "Nombre completo",
  "Email",
  "WhatsApp",
  "Comentario",
  "Fecha visita sugerida",
  "Franja horaria",
  "Estado",
];

const IDX = COLUMNAS.reduce((acc, nombre, i) => {
  acc[nombre] = i;
  return acc;
}, {});

// ─── Entradas del formulario (POST desde Next.js) ──────────────────

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    const requeridos = [
      "propertyId",
      "nombreCompleto",
      "email",
      "whatsappCodigo",
      "whatsappNumero",
      "fechaVisita",
      "franjaHoraria",
    ];
    for (const campo of requeridos) {
      if (!body[campo]) {
        return jsonResponse({ ok: false, error: `Falta el campo ${campo}` });
      }
    }

    const hoja = getOrCreateSheet(HOJA_PENDIENTES);
    const id = Utilities.getUuid();
    const token = Utilities.getUuid();

    const fila = new Array(COLUMNAS.length);
    fila[IDX["ID"]] = id;
    fila[IDX["Token"]] = token;
    fila[IDX["Fecha registro"]] = new Date();
    fila[IDX["Propiedad ID"]] = body.propertyId;
    fila[IDX["Propiedad título"]] = body.propertyTitulo || "";
    fila[IDX["Nombre completo"]] = body.nombreCompleto;
    fila[IDX["Email"]] = body.email;
    // El apóstrofe inicial fuerza a Sheets a tratar el valor como texto
    // plano: sin esto, un valor que empieza con "+" (código de país) se
    // interpreta como el inicio de una fórmula y la celda muestra #ERROR!.
    fila[IDX["WhatsApp"]] = `'${body.whatsappCodigo} ${body.whatsappNumero}`;
    fila[IDX["Comentario"]] = body.comentario || "";
    fila[IDX["Fecha visita sugerida"]] = body.fechaVisita;
    fila[IDX["Franja horaria"]] = body.franjaHoraria === "manana" ? "Mañana" : "Tarde";
    fila[IDX["Estado"]] = "Pendiente";

    hoja.appendRow(fila);

    enviarCorreoAprobacion({
      id,
      token,
      propertyTitulo: body.propertyTitulo || body.propertyId,
      nombreCompleto: body.nombreCompleto,
      email: body.email,
      whatsapp: `${body.whatsappCodigo} ${body.whatsappNumero}`,
      comentario: body.comentario || "(sin comentario)",
      fechaVisita: body.fechaVisita,
      franjaHoraria: body.franjaHoraria === "manana" ? "Mañana" : "Tarde",
    });

    return jsonResponse({ ok: true, id });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// ─── Correo con links de Aprobar / Rechazar ────────────────────────

function enviarCorreoAprobacion(datos) {
  const baseUrl = ScriptApp.getService().getUrl();
  const aprobarUrl = `${baseUrl}?action=approve&id=${encodeURIComponent(
    datos.id
  )}&token=${encodeURIComponent(datos.token)}`;
  const rechazarUrl = `${baseUrl}?action=reject&id=${encodeURIComponent(
    datos.id
  )}&token=${encodeURIComponent(datos.token)}`;

  const asunto = `Nuevo contacto: ${datos.propertyTitulo}`;

  const cuerpoHtml = `
    <p>Nuevo contacto recibido desde el sitio web:</p>
    <table style="border-collapse:collapse">
      <tr><td style="padding:4px 8px"><b>Propiedad</b></td><td style="padding:4px 8px">${escapeHtml(datos.propertyTitulo)}</td></tr>
      <tr><td style="padding:4px 8px"><b>Nombre</b></td><td style="padding:4px 8px">${escapeHtml(datos.nombreCompleto)}</td></tr>
      <tr><td style="padding:4px 8px"><b>Email</b></td><td style="padding:4px 8px">${escapeHtml(datos.email)}</td></tr>
      <tr><td style="padding:4px 8px"><b>WhatsApp</b></td><td style="padding:4px 8px">${escapeHtml(datos.whatsapp)}</td></tr>
      <tr><td style="padding:4px 8px"><b>Visita sugerida</b></td><td style="padding:4px 8px">${escapeHtml(datos.fechaVisita)} — ${escapeHtml(datos.franjaHoraria)}</td></tr>
      <tr><td style="padding:4px 8px"><b>Comentario</b></td><td style="padding:4px 8px">${escapeHtml(datos.comentario)}</td></tr>
    </table>
    <p style="margin-top:16px">
      <a href="${aprobarUrl}" style="background:#16a34a;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;margin-right:8px">Aprobar</a>
      <a href="${rechazarUrl}" style="background:#dc2626;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px">Rechazar</a>
    </p>
  `;

  SOCIOS_EMAILS.forEach((email) => {
    GmailApp.sendEmail(email, asunto, "", {
      htmlBody: cuerpoHtml,
      name: REMITENTE_NOMBRE,
    });
  });
}

function escapeHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Aprobar / Rechazar (GET desde el link del correo) ─────────────

function doGet(e) {
  const action = e.parameter.action;
  const id = e.parameter.id;
  const token = e.parameter.token;

  if (!action || !id || !token) {
    return htmlResponse("Solicitud inválida.");
  }

  const hoja = getOrCreateSheet(HOJA_PENDIENTES);
  const datos = hoja.getDataRange().getValues();

  for (let fila = 1; fila < datos.length; fila++) {
    const valores = datos[fila];
    if (valores[IDX["ID"]] !== id) continue;

    if (valores[IDX["Token"]] !== token) {
      return htmlResponse("Token inválido. Este link no es válido.");
    }

    const estadoActual = valores[IDX["Estado"]];
    if (estadoActual !== "Pendiente") {
      return htmlResponse(
        `Este contacto ya fue procesado anteriormente (estado actual: ${estadoActual}).`
      );
    }

    const numeroFila = fila + 1; // getValues() es 0-index, las hojas son 1-index

    if (action === "approve") {
      valores[IDX["Estado"]] = "Aprobado";
      const aprobados = getOrCreateSheet(HOJA_APROBADOS);
      aprobados.appendRow(valores);
      hoja.deleteRow(numeroFila);
      return htmlResponse("Contacto aprobado. Se movió a la hoja Aprobados.");
    }

    if (action === "reject") {
      hoja.getRange(numeroFila, IDX["Estado"] + 1).setValue("Rechazado");
      return htmlResponse("Contacto rechazado.");
    }

    return htmlResponse("Acción no reconocida.");
  }

  return htmlResponse("No se encontró el contacto (¿ya fue procesado y movido?).");
}

function htmlResponse(mensaje) {
  return HtmlService.createHtmlOutput(
    `<html><body style="font-family:sans-serif;padding:40px;text-align:center">
      <h2>Grupo Propiedades Santiago</h2>
      <p>${escapeHtml(mensaje)}</p>
    </body></html>`
  );
}

// ─── Utilidades de hojas ────────────────────────────────────────────

function getOrCreateSheet(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(nombre);
  if (!hoja) {
    hoja = ss.insertSheet(nombre);
    hoja.appendRow(COLUMNAS);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

/**
 * Ejecutar una vez manualmente (desde el editor de Apps Script, botón
 * "Ejecutar") para crear las hojas "Pendientes" y "Aprobados" con sus
 * encabezados antes del primer despliegue.
 */
function inicializarHojas() {
  getOrCreateSheet(HOJA_PENDIENTES);
  getOrCreateSheet(HOJA_APROBADOS);
}
