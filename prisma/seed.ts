import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("Falta la variable de entorno DATABASE_URL");
}
const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

// Contraseña temporal por defecto para los 3 socios en ambiente Beta.
// Deben cambiarla apenas tengan acceso (no hay pantalla de "cambiar
// contraseña" todavía — se actualiza reemplazando el hash acá y
// re-corriendo el seed, o directo en la base de datos).
const DEFAULT_PASSWORD = "GrupoProp2026!";

const SOCIOS = [
  { nombre: "Patricio Olivares", email: "patricio@grupopropiedades.cl" },
  { nombre: "Sergio Moreira", email: "sergio@grupopropiedades.cl" },
  { nombre: "Oscar Aranguiz", email: "oscar.aranguiz.i@gmail.com" },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const socio of SOCIOS) {
    await prisma.admin.upsert({
      where: { email: socio.email },
      update: { nombre: socio.nombre },
      create: {
        nombre: socio.nombre,
        email: socio.email,
        passwordHash,
      },
    });
  }

  console.log(`Seed OK. Contraseña temporal para los 3 socios: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
