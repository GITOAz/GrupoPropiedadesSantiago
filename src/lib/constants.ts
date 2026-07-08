export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  casa_nueva: "Casa nueva",
  casa_usada: "Casa usada",
  depto_nuevo: "Departamento nuevo",
  depto_usado: "Departamento usado",
  bodega: "Bodega",
  estacionamiento: "Estacionamiento",
};

export const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_LABELS) as Array<
  keyof typeof PROPERTY_TYPE_LABELS
>;

export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  disponible: "Disponible",
  reservada: "Reservada",
  vendida: "Vendida",
};

export const PROPERTY_STATUSES = Object.keys(
  PROPERTY_STATUS_LABELS
) as Array<keyof typeof PROPERTY_STATUS_LABELS>;

export const FRANJA_HORARIA_LABELS: Record<string, string> = {
  manana: "Mañana",
  tarde: "Tarde",
};

export const CHILE_REGIONS = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana de Santiago",
  "Libertador General Bernardo O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén del General Carlos Ibáñez del Campo",
  "Magallanes y de la Antártica Chilena",
];

export const COUNTRY_CODES = [
  { code: "+56", label: "Chile (+56)" },
  { code: "+54", label: "Argentina (+54)" },
  { code: "+51", label: "Perú (+51)" },
  { code: "+57", label: "Colombia (+57)" },
  { code: "+52", label: "México (+52)" },
  { code: "+1", label: "EE.UU. / Canadá (+1)" },
  { code: "+34", label: "España (+34)" },
];

export const SITE_NAME = "Grupo Propiedades Santiago";

export const CONTACT_DISPLAY_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL_DISPLAY ||
  "contacto@grupopropiedadessantiago.cl";

// Vacíos hasta que existan las cuentas reales. El header y el footer
// solo muestran el ícono de cada red cuando su URL no está vacía —
// para activarlos, completa estas variables en .env y no hace falta
// tocar código.
export const SOCIAL_LINKS = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
};

export const CLP_FORMATTER = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});
