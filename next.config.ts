import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Permite subir fotos/videos de propiedades desde el panel admin.
      bodySizeLimit: "100mb",
    },
    // El proxy (src/proxy.ts) intercepta /admin/*, incluida la subida de
    // media, y por defecto solo bufferea los primeros 10MB del body antes
    // de reenviarlo al server action — lo que corta el archivo y revienta
    // el parseo del multipart/form-data ("Unexpected end of form").
    proxyClientMaxBodySize: "100mb",
    // Evita que el router cache del cliente reutilice, tras navegar,
    // renders pre-fetcheados de páginas dependientes de cookies (ej. el
    // panel admin) que quedaron desactualizados (p.ej. sin sesión).
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
