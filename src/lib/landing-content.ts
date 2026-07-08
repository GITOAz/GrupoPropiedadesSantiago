// Copy e imágenes de vitrina para la home. Las imágenes son fotos de
// stock (Unsplash) temporales mientras no hay fotografía real de las
// propiedades — reemplazar por contenido propio cuando esté disponible.

import { SITE_NAME } from "@/lib/constants";

function unsplash(id: string, w = 1200) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

export const HERO_IMAGE = unsplash("1560518883-ce09059eeffa", 1400);

export const BUSINESS_LINES = [
  {
    tipo: "casa_nueva",
    titulo: "Casas nuevas",
    descripcion: "Estrena tu hogar ideal, listo para hacer historia en él.",
    imagen: unsplash("1512917774080-9991f1c4c750"),
  },
  {
    tipo: "casa_usada",
    titulo: "Casas usadas",
    descripcion: "Hogares con historia, listos para recibir a una nueva familia.",
    imagen: unsplash("1600607687939-ce8a6c25118c"),
  },
  {
    tipo: "depto_nuevo",
    titulo: "Departamentos nuevos",
    descripcion: "Departamentos a estrenar, pensados para tu día a día.",
    imagen: unsplash("1545324418-cc1a3fa10c00"),
  },
  {
    tipo: "depto_usado",
    titulo: "Departamentos usados",
    descripcion: "Espacios ya habitados, con la ubicación que estás buscando.",
    imagen: unsplash("1493809842364-78817add7ffb"),
  },
  {
    tipo: "bodega",
    titulo: "Bodegas",
    descripcion: "Espacio extra para guardar lo que más quieres, seguro y accesible.",
    imagen: unsplash("1553413077-190dd305871c"),
  },
  {
    tipo: "estacionamiento",
    titulo: "Estacionamientos",
    descripcion: "Un lugar fijo para tu auto, cerca de donde vives o trabajas.",
    imagen: unsplash("1506521781263-d8422e82f27a"),
  },
] as const;

export const VALUE_PROPS = [
  {
    titulo: "Atención cercana",
    descripcion: `Hablas directo con nosotros, los socios de ${SITE_NAME} — sin call center ni intermediarios.`,
    icon: "home",
  },
  {
    titulo: "Variedad bajo un mismo techo",
    descripcion:
      "Casas, departamentos, bodegas y estacionamientos, nuevos y usados, en un solo lugar.",
    icon: "layers",
  },
  {
    titulo: "Visitas simples de coordinar",
    descripcion:
      "Eliges fecha y horario preferido desde la ficha de la propiedad; nosotros coordinamos el resto.",
    icon: "calendar",
  },
  {
    titulo: "Transparencia en cada etapa",
    descripcion:
      "Del primer contacto a la firma, te mantenemos informado sin letra chica.",
    icon: "shield",
  },
] as const;
