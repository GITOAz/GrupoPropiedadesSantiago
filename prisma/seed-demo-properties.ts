/**
 * Carga propiedades ficticias de demostración, 3 por cada línea de
 * negocio, para tener contenido con el que probar el panel admin y el
 * sitio público. Usa fotos de stock (Unsplash) — reemplazar por fotos
 * reales antes de publicar en producción.
 *
 * Uso: npx tsx prisma/seed-demo-properties.ts
 * (No se ejecuta con `prisma db seed` — es un script aparte, a correr
 * solo cuando se quiera poblar la base con datos de prueba.)
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("Falta la variable de entorno DATABASE_URL");
}
const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`;
}

type DemoProperty = {
  tipo:
    | "casa_nueva"
    | "casa_usada"
    | "depto_nuevo"
    | "depto_usado"
    | "bodega"
    | "estacionamiento";
  titulo: string;
  descripcion: string;
  direccion: string;
  comuna: string;
  region: string;
  precio: number;
  estado: "disponible" | "reservada" | "vendida";
  imagenes: string[];
};

const PROPERTIES: DemoProperty[] = [
  // Casas nuevas
  {
    tipo: "casa_nueva",
    titulo: "Casa 3D/2B en condominio Los Aromos",
    descripcion:
      "Casa nueva a estrenar en condominio cerrado con áreas verdes y seguridad 24/7. Living-comedor amplio, cocina americana, patio techado y estacionamiento para dos autos.",
    direccion: "Pasaje Los Aromos 245",
    comuna: "Puerto Montt",
    region: "Los Lagos",
    precio: 95000000,
    estado: "disponible",
    imagenes: [unsplash("1512917774080-9991f1c4c750")],
  },
  {
    tipo: "casa_nueva",
    titulo: "Casa nueva a estrenar, sector Chicureo",
    descripcion:
      "Amplia casa de dos pisos en exclusivo sector, con quincho, jardín y terminaciones de primera calidad. Ideal para familias que buscan tranquilidad y espacio.",
    direccion: "Camino El Alba 1820",
    comuna: "Colina",
    region: "Metropolitana de Santiago",
    precio: 180000000,
    estado: "disponible",
    imagenes: [unsplash("1568605114967-8130f3a36994")],
  },
  {
    tipo: "casa_nueva",
    titulo: "Casa 4D/3B con jardín, Las Condes",
    descripcion:
      "Casa nueva de diseño contemporáneo, cuatro dormitorios en suite, jardín privado y luminosidad natural en todos los ambientes. A pasos de colegios y comercio.",
    direccion: "Calle Apoquindo 6540",
    comuna: "Las Condes",
    region: "Metropolitana de Santiago",
    precio: 320000000,
    estado: "reservada",
    imagenes: [unsplash("1600585154340-be6161a56a0c")],
  },

  // Casas usadas
  {
    tipo: "casa_usada",
    titulo: "Casa familiar 3D/2B, Ñuñoa",
    descripcion:
      "Casa en buen estado, ubicada en tranquilo pasaje residencial. Tres dormitorios, living-comedor separado, patio con espacio para ampliar.",
    direccion: "Pasaje Suecia 412",
    comuna: "Ñuñoa",
    region: "Metropolitana de Santiago",
    precio: 145000000,
    estado: "disponible",
    imagenes: [unsplash("1502672260266-1c1ef2d93688")],
  },
  {
    tipo: "casa_usada",
    titulo: "Casa amplia con patio, Valdivia centro",
    descripcion:
      "Casa de un piso a pasos del centro de Valdivia, con patio amplio, quincho y bodega. Excelente conectividad y cercana a áreas verdes junto al río.",
    direccion: "Avenida Ramón Picarte 1150",
    comuna: "Valdivia",
    region: "Los Ríos",
    precio: 88000000,
    estado: "disponible",
    imagenes: [unsplash("1600607687939-ce8a6c25118c")],
  },
  {
    tipo: "casa_usada",
    titulo: "Casa esquina 4D/2B, La Serena",
    descripcion:
      "Casa esquina con buena orientación, cuatro dormitorios, dos baños y patio amplio. A minutos de la playa y del centro de La Serena.",
    direccion: "Calle Cordovez 890",
    comuna: "La Serena",
    region: "Coquimbo",
    precio: 110000000,
    estado: "vendida",
    imagenes: [unsplash("1449844908441-8829872d2607")],
  },

  // Departamentos nuevos
  {
    tipo: "depto_nuevo",
    titulo: "Depto 2D/2B a estrenar, Providencia",
    descripcion:
      "Departamento nuevo en edificio con piscina, gimnasio y sala de eventos. Dos dormitorios, dos baños y logia. A pasos del metro y comercio de Providencia.",
    direccion: "Avenida Providencia 2340",
    comuna: "Providencia",
    region: "Metropolitana de Santiago",
    precio: 135000000,
    estado: "disponible",
    imagenes: [unsplash("1545324418-cc1a3fa10c00")],
  },
  {
    tipo: "depto_nuevo",
    titulo: "Depto 1D/1B con terraza, Viña del Mar",
    descripcion:
      "Departamento a estrenar con terraza y vista parcial al mar. Ideal primera vivienda o inversión, cercano a Avenida Perú y el borde costero.",
    direccion: "Calle 3 Norte 780",
    comuna: "Viña del Mar",
    region: "Valparaíso",
    precio: 78000000,
    estado: "disponible",
    imagenes: [unsplash("1554995207-c18c203602cb")],
  },
  {
    tipo: "depto_nuevo",
    titulo: "Depto 3D/2B piso alto, Concepción",
    descripcion:
      "Departamento nuevo en piso alto con excelente vista, tres dormitorios y dos baños. Edificio con áreas comunes y estacionamiento incluido.",
    direccion: "Avenida Los Carrera 1245",
    comuna: "Concepción",
    region: "Biobío",
    precio: 120000000,
    estado: "reservada",
    imagenes: [unsplash("1522708323590-d24dbb6b0267")],
  },

  // Departamentos usados
  {
    tipo: "depto_usado",
    titulo: "Depto 2D/1B cercano a metro, Ñuñoa",
    descripcion:
      "Departamento en buen estado, dos dormitorios y un baño, a pocas cuadras del metro. Edificio con conserjería y áreas comunes.",
    direccion: "Avenida Irarrázaval 3120",
    comuna: "Ñuñoa",
    region: "Metropolitana de Santiago",
    precio: 95000000,
    estado: "disponible",
    imagenes: [unsplash("1493809842364-78817add7ffb")],
  },
  {
    tipo: "depto_usado",
    titulo: "Depto 1D/1B, Estación Central",
    descripcion:
      "Departamento funcional de un dormitorio, ideal inversión para arriendo. Excelente conectividad con metro y locomoción hacia todo Santiago.",
    direccion: "Calle Exposición 450",
    comuna: "Estación Central",
    region: "Metropolitana de Santiago",
    precio: 58000000,
    estado: "disponible",
    imagenes: [unsplash("1484154218962-a197022b5858")],
  },
  {
    tipo: "depto_usado",
    titulo: "Depto 3D/2B vista mar, Viña del Mar",
    descripcion:
      "Amplio departamento con vista al mar, tres dormitorios y dos baños. Edificio con piscina y a pasos de la playa.",
    direccion: "Avenida San Martín 560",
    comuna: "Viña del Mar",
    region: "Valparaíso",
    precio: 130000000,
    estado: "disponible",
    imagenes: [unsplash("1556911220-e15b29be8c8f")],
  },

  // Bodegas
  {
    tipo: "bodega",
    titulo: "Bodega 40m² en Renca",
    descripcion:
      "Bodega de 40m² con portón de acceso vehicular, ideal para almacenaje comercial o particular. Sector industrial con buena conectividad.",
    direccion: "Camino Lo Echevers 890",
    comuna: "Renca",
    region: "Metropolitana de Santiago",
    precio: 25000000,
    estado: "disponible",
    imagenes: [unsplash("1587293852726-70cdb56c2866")],
  },
  {
    tipo: "bodega",
    titulo: "Bodega industrial 80m², Quilicura",
    descripcion:
      "Bodega industrial de 80m² con altura para racks, oficina interior y baño. Ubicada en parque de bodegas con vigilancia.",
    direccion: "Avenida Américo Vespucio 1450",
    comuna: "Quilicura",
    region: "Metropolitana de Santiago",
    precio: 45000000,
    estado: "disponible",
    imagenes: [unsplash("1553413077-190dd305871c")],
  },
  {
    tipo: "bodega",
    titulo: "Bodega segura 25m², Maipú",
    descripcion:
      "Bodega de 25m² en condominio de bodegas con acceso controlado. Práctica para guardar herramientas, mercadería o artículos de temporada.",
    direccion: "Avenida Pajaritos 3200",
    comuna: "Maipú",
    region: "Metropolitana de Santiago",
    precio: 18000000,
    estado: "vendida",
    imagenes: [unsplash("1553413077-190dd305871c")],
  },

  // Estacionamientos
  {
    tipo: "estacionamiento",
    titulo: "Estacionamiento subterráneo, Las Condes",
    descripcion:
      "Estacionamiento subterráneo techado en edificio con acceso controlado. Ideal para complementar un departamento en el sector oriente.",
    direccion: "Avenida Apoquindo 4501",
    comuna: "Las Condes",
    region: "Metropolitana de Santiago",
    precio: 12000000,
    estado: "disponible",
    imagenes: [unsplash("1506521781263-d8422e82f27a")],
  },
  {
    tipo: "estacionamiento",
    titulo: "Estacionamiento techado, Providencia",
    descripcion:
      "Estacionamiento techado en edificio residencial, fácil acceso y buena maniobrabilidad. A pasos de Avenida Providencia.",
    direccion: "Calle Manuel Montt 890",
    comuna: "Providencia",
    region: "Metropolitana de Santiago",
    precio: 9500000,
    estado: "disponible",
    imagenes: [unsplash("1470224114660-3f6686c562eb")],
  },
  {
    tipo: "estacionamiento",
    titulo: "Estacionamiento doble, Ñuñoa",
    descripcion:
      "Dos estacionamientos contiguos en edificio con conserjería. Se pueden vender juntos o por separado.",
    direccion: "Avenida Grecia 2100",
    comuna: "Ñuñoa",
    region: "Metropolitana de Santiago",
    precio: 14000000,
    estado: "reservada",
    imagenes: [unsplash("1506521781263-d8422e82f27a")],
  },
];

async function main() {
  for (const item of PROPERTIES) {
    const { imagenes, ...data } = item;
    const property = await prisma.property.create({
      data: {
        ...data,
        imagenes: {
          create: imagenes.map((url, orden) => ({ url, orden })),
        },
      },
    });
    console.log(`Creada: ${property.titulo}`);
  }

  console.log(`\nListo: ${PROPERTIES.length} propiedades ficticias cargadas.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
