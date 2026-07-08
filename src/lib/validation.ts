import { z } from "zod";

export const propertyTypeSchema = z.enum([
  "casa_nueva",
  "casa_usada",
  "depto_nuevo",
  "depto_usado",
  "bodega",
  "estacionamiento",
]);
export const propertyStatusSchema = z.enum(["disponible", "reservada", "vendida"]);

export const propertyInputSchema = z.object({
  tipo: propertyTypeSchema,
  titulo: z.string().trim().min(3, "El título es muy corto").max(150),
  descripcion: z.string().trim().min(10, "La descripción es muy corta"),
  direccion: z.string().trim().min(3, "La dirección es requerida"),
  comuna: z.string().trim().min(2, "La comuna es requerida"),
  region: z.string().trim().min(2, "La región es requerida"),
  precio: z.coerce.number().int().positive("El precio debe ser mayor a 0"),
  estado: propertyStatusSchema.default("disponible"),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;

// Número de WhatsApp: solo dígitos, entre 8 y 12 caracteres (sin código de país).
const whatsappNumberRegex = /^[0-9]{8,12}$/;

export const contactInputSchema = z.object({
  propertyId: z.string().min(1, "Falta la propiedad"),
  nombreCompleto: z.string().trim().min(3, "Ingresa tu nombre completo").max(150),
  email: z.string().trim().email("Email inválido"),
  whatsappCodigo: z.string().trim().min(2).max(5),
  whatsappNumero: z
    .string()
    .trim()
    .regex(whatsappNumberRegex, "Ingresa un número de WhatsApp válido (solo dígitos)"),
  comentario: z.string().trim().max(1000).optional().or(z.literal("")),
  fechaVisita: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida"),
  franjaHoraria: z.enum(["manana", "tarde"]),
});

export type ContactInput = z.infer<typeof contactInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});
