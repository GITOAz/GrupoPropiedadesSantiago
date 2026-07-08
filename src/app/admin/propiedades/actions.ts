"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { propertyInputSchema } from "@/lib/validation";
import {
  saveMediaFile,
  deleteMediaFile,
  isAllowedImage,
  isAllowedVideo,
} from "@/lib/storage";

export type PropertyFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

function parsePropertyForm(formData: FormData) {
  return propertyInputSchema.safeParse({
    tipo: formData.get("tipo"),
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion"),
    direccion: formData.get("direccion"),
    comuna: formData.get("comuna"),
    region: formData.get("region"),
    precio: formData.get("precio"),
    estado: formData.get("estado") || "disponible",
  });
}

export async function createPropertyAction(
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  await requireSession();

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    return {
      error: "Revisa los campos del formulario.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v?.[0] ?? "",
        ])
      ),
    };
  }

  const property = await prisma.property.create({ data: parsed.data });

  revalidatePath("/admin/propiedades");
  revalidatePath("/propiedades");
  redirect(`/admin/propiedades/${property.id}/editar`);
}

export async function updatePropertyAction(
  propertyId: string,
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  await requireSession();

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    return {
      error: "Revisa los campos del formulario.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v?.[0] ?? "",
        ])
      ),
    };
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: parsed.data,
  });

  revalidatePath("/admin/propiedades");
  revalidatePath(`/admin/propiedades/${propertyId}/editar`);
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${propertyId}`);

  return {};
}

export async function deletePropertyAction(propertyId: string) {
  await requireSession();

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { imagenes: true, videos: true },
  });

  if (property) {
    await Promise.all([
      ...property.imagenes.map((img) => deleteMediaFile(img.url)),
      ...property.videos.map((vid) => deleteMediaFile(vid.url)),
    ]);
    await prisma.property.delete({ where: { id: propertyId } });
  }

  revalidatePath("/admin/propiedades");
  revalidatePath("/propiedades");
  redirect("/admin/propiedades");
}

export type MediaFormState = {
  error?: string;
};

export async function addMediaAction(
  propertyId: string,
  _prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  await requireSession();

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return { error: "Selecciona al menos un archivo." };
  }

  const existingCount = await prisma.propertyImage.count({ where: { propertyId } });
  const existingVideoCount = await prisma.propertyVideo.count({ where: { propertyId } });

  let imgOrden = existingCount;
  let vidOrden = existingVideoCount;

  for (const file of files) {
    if (isAllowedImage(file.type)) {
      const stored = await saveMediaFile(file, propertyId);
      await prisma.propertyImage.create({
        data: { propertyId, url: stored.url, orden: imgOrden++ },
      });
    } else if (isAllowedVideo(file.type)) {
      const stored = await saveMediaFile(file, propertyId);
      await prisma.propertyVideo.create({
        data: { propertyId, url: stored.url, orden: vidOrden++ },
      });
    } else {
      return {
        error: `Tipo de archivo no soportado: ${file.type || file.name}`,
      };
    }
  }

  revalidatePath(`/admin/propiedades/${propertyId}/editar`);
  revalidatePath(`/propiedades/${propertyId}`);
  return {};
}

export async function deleteImageAction(propertyId: string, imageId: string) {
  await requireSession();
  const image = await prisma.propertyImage.findUnique({ where: { id: imageId } });
  if (image) {
    await deleteMediaFile(image.url);
    await prisma.propertyImage.delete({ where: { id: imageId } });
  }
  revalidatePath(`/admin/propiedades/${propertyId}/editar`);
  revalidatePath(`/propiedades/${propertyId}`);
}

export async function deleteVideoAction(propertyId: string, videoId: string) {
  await requireSession();
  const video = await prisma.propertyVideo.findUnique({ where: { id: videoId } });
  if (video) {
    await deleteMediaFile(video.url);
    await prisma.propertyVideo.delete({ where: { id: videoId } });
  }
  revalidatePath(`/admin/propiedades/${propertyId}/editar`);
  revalidatePath(`/propiedades/${propertyId}`);
}
