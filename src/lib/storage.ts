import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Capa de almacenamiento de archivos.
 *
 * Usa Cloudinary cuando las credenciales están configuradas (producción).
 * Si no lo están, guarda en disco local bajo public/uploads (conveniencia
 * para desarrollo sin necesidad de una cuenta de Cloudinary) — pero en
 * hosting serverless (Vercel, Netlify, etc.) el disco no persiste entre
 * despliegues, así que Cloudinary es obligatorio ahí.
 *
 * El resto de la app (rutas API, formularios, componentes) solo conoce
 * la interfaz `saveMediaFile` / `deleteMediaFile` y no le importa cuál
 * de los dos backends está activo.
 */

const CLOUDINARY_ENABLED = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const CLOUDINARY_FOLDER = "grupo-propiedades-santiago/properties";
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export type StoredFile = {
  url: string;
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export function isAllowedImage(mimeType: string) {
  return ALLOWED_IMAGE_TYPES.includes(mimeType);
}

export function isAllowedVideo(mimeType: string) {
  return ALLOWED_VIDEO_TYPES.includes(mimeType);
}

function extensionFromMime(mimeType: string) {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };
  return map[mimeType] ?? "bin";
}

export async function saveMediaFile(
  file: File,
  propertyId: string
): Promise<StoredFile> {
  return CLOUDINARY_ENABLED
    ? saveToCloudinary(file, propertyId)
    : saveToLocalDisk(file, propertyId);
}

export async function deleteMediaFile(url: string): Promise<void> {
  if (url.includes("res.cloudinary.com")) {
    await deleteFromCloudinary(url);
    return;
  }
  if (!url.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", url);
  try {
    await unlink(filePath);
  } catch {
    // Si el archivo ya no existe, no es un error fatal.
  }
}

// ─── Cloudinary ──────────────────────────────────────────────────────

async function saveToCloudinary(
  file: File,
  propertyId: string
): Promise<StoredFile> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const isVideo = isAllowedVideo(file.type);
  const publicId = `${CLOUDINARY_FOLDER}/${propertyId}/${randomUUID()}`;

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: publicId, resource_type: isVideo ? "video" : "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary no devolvió resultado"));
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });

  return { url: result.secure_url };
}

async function deleteFromCloudinary(url: string): Promise<void> {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return;

  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(url);
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: isVideo ? "video" : "image",
    });
  } catch {
    // Best-effort: si falla el borrado remoto no bloqueamos el flujo.
  }
}

function extractCloudinaryPublicId(url: string): string | null {
  // https://res.cloudinary.com/<cloud>/image/upload/v169.../carpeta/archivo.ext
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+(?:\?.*)?$/);
  return match ? match[1] : null;
}

// ─── Disco local (solo desarrollo) ──────────────────────────────────

async function saveToLocalDisk(
  file: File,
  propertyId: string
): Promise<StoredFile> {
  const targetDir = path.join(UPLOADS_DIR, "properties", propertyId);
  await mkdir(targetDir, { recursive: true });

  const ext = extensionFromMime(file.type);
  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(targetDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return { url: `/uploads/properties/${propertyId}/${filename}` };
}
