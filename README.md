# Grupo Propiedades Santiago — Beta

Plataforma inmobiliaria a medida (venta de casas, departamentos, bodegas
y estacionamientos). En preparación para publicarse en Vercel.

## Stack

- **Next.js 16** (App Router, Server Actions) — frontend + backend.
- **Postgres** vía Prisma (`prisma/schema.prisma`) — pensado para Neon o
  Vercel Postgres (integración nativa de Vercel).
- **Almacenamiento de fotos/video**: Cloudinary cuando hay credenciales
  configuradas; si no, cae de vuelta a disco local (`public/uploads`) —
  solo sirve para desarrollo, no para producción/serverless. Abstraído en
  [`src/lib/storage.ts`](./src/lib/storage.ts).
- **Auth del panel admin**: cookie de sesión firmada (JWT vía `jose`),
  sin proveedor externo — 3 usuarios (socios) sembrados en la base.
- **Google Apps Script** ([`apps-script/`](./apps-script)): flujo de
  aprobación de contactos por correo (Sheets + Gmail), fuera del deploy
  de Next.js — ya desplegado y conectado vía `APPS_SCRIPT_WEBHOOK_URL`.

## Primeros pasos (desarrollo local)

Requiere una base Postgres real (Neon, Vercel Postgres, o local vía
Docker) — el proyecto ya no usa SQLite. Completa `DATABASE_URL` en
`.env` antes de seguir.

```bash
npm install
npx prisma migrate dev   # crea las tablas en la base configurada
npx prisma db seed       # crea los 3 usuarios socios
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Login del panel admin

Rutas en `/admin/*`. Usuarios sembrados (ver `prisma/seed.ts`):

| Socio | Email | Contraseña temporal |
|---|---|---|
| Patricio Olivares | patricio@grupopropiedades.cl | `GrupoProp2026!` |
| Sergio Moreira | sergio@grupopropiedades.cl | `GrupoProp2026!` |
| Oscar Aranguiz | oscar.aranguiz.i@gmail.com | `GrupoProp2026!` |

Cambia la contraseña por defecto editando `prisma/seed.ts` (o directo en
la base) antes de dar acceso real a los socios — no hay pantalla de
"cambiar contraseña" todavía.

## Publicar en Vercel

1. Sube el repo a GitHub (si aún no lo está) y conéctalo en
   [vercel.com/new](https://vercel.com/new).
2. En el proyecto de Vercel, agrega la integración de **Postgres**
   (Storage → Postgres) — genera `DATABASE_URL` automáticamente.
3. Crea una cuenta en [Cloudinary](https://cloudinary.com) (plan gratis)
   y copia las 3 credenciales desde el Dashboard.
4. En **Settings → Environment Variables** del proyecto en Vercel,
   agrega el resto de las variables de la tabla más abajo (copiando los
   valores desde tu `.env` local, generando un `AUTH_SECRET` nuevo para
   producción).
5. Deploy. Después del primer deploy, corre las migraciones contra la
   base de producción:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
   (usando el `DATABASE_URL` de producción — vía `vercel env pull` o
   pegándolo temporalmente en tu `.env` local).

## Estructura

```
src/
  app/
    page.tsx                     # Home pública / landing
    propiedades/                 # Listado filtrable + ficha de detalle
    admin/                       # Panel admin (protegido por proxy)
    api/contacto/route.ts        # Endpoint público del form de contacto
  components/                    # UI compartida (forms, cards, galería)
  lib/
    prisma.ts                    # Cliente Prisma (adapter Postgres)
    auth.ts                      # Sesión de socios (JWT en cookie)
    storage.ts                   # Guardado de fotos/video (Cloudinary / local)
    validation.ts                # Esquemas Zod (propiedad, contacto, login)
    constants.ts                 # Enums/labels, regiones, códigos país
  proxy.ts                       # Protege /admin/* (requiere sesión)
prisma/
  schema.prisma                  # Modelo de datos
  seed.ts                        # Crea los 3 socios
  seed-demo-properties.ts        # Propiedades ficticias de prueba (opcional)
apps-script/
  Code.gs                        # Apps Script: Sheets + Gmail
  README.md                      # Cómo desplegarlo
```

## Modelo de datos

`Property`: `tipo` (casa_nueva | casa_usada | depto_nuevo | depto_usado |
bodega | estacionamiento), título, descripción, dirección, comuna,
región, precio, `estado` (disponible | reservada | vendida), imágenes[],
videos[], fecha de creación. Ver [`prisma/schema.prisma`](./prisma/schema.prisma).

## Flujo de contacto → aprobación

1. El visitante llena el formulario en la ficha de una propiedad.
2. `POST /api/contacto` valida los datos, guarda una copia local
   (`ContactRequest`, respaldo) y reenvía el payload al Web App de
   Apps Script.
3. El Apps Script escribe el registro en la hoja "Pendientes" y envía un
   correo a los 3 socios con links **Aprobar** / **Rechazar**.
4. Al aprobar, la fila se mueve a "Aprobados"; al rechazar, queda
   marcada "Rechazado" en "Pendientes".

El email `contacto@grupopropiedadessantiago.cl` que se muestra en el
sitio es **solo un enmascaramiento visual** — el envío/recepción real de
correo ocurre desde la cuenta personal usada para desplegar el Apps
Script (ver [`apps-script/README.md`](./apps-script/README.md)).

## Variables de entorno (`.env`)

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Conexión Postgres (Neon / Vercel Postgres) |
| `AUTH_SECRET` | Firma de la cookie de sesión del panel admin |
| `APPS_SCRIPT_WEBHOOK_URL` | URL `/exec` del Web App de Apps Script |
| `NEXT_PUBLIC_CONTACT_EMAIL_DISPLAY` | Email de contacto mostrado en el sitio (enmascarado) |
| `NEXT_PUBLIC_FACEBOOK_URL` / `_INSTAGRAM_URL` / `_LINKEDIN_URL` | Links de redes sociales (vacíos = ícono oculto) |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Credenciales de Cloudinary para fotos/video (vacías = cae a disco local, solo dev) |
