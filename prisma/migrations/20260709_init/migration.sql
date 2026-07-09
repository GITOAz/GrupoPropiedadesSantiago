-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('casa_nueva', 'casa_usada', 'depto_nuevo', 'depto_usado', 'bodega', 'estacionamiento');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('disponible', 'reservada', 'vendida');

-- CreateEnum
CREATE TYPE "FranjaHoraria" AS ENUM ('manana', 'tarde');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('enviado', 'error_envio');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "tipo" "PropertyType" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "comuna" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "estado" "PropertyStatus" NOT NULL DEFAULT 'disponible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyVideo" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsappCodigo" TEXT NOT NULL,
    "whatsappNumero" TEXT NOT NULL,
    "comentario" TEXT,
    "fechaVisita" TIMESTAMP(3) NOT NULL,
    "franjaHoraria" "FranjaHoraria" NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'enviado',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Property_tipo_idx" ON "Property"("tipo");

-- CreateIndex
CREATE INDEX "Property_estado_idx" ON "Property"("estado");

-- CreateIndex
CREATE INDEX "Property_comuna_idx" ON "Property"("comuna");

-- CreateIndex
CREATE INDEX "PropertyImage_propertyId_idx" ON "PropertyImage"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyVideo_propertyId_idx" ON "PropertyVideo"("propertyId");

-- CreateIndex
CREATE INDEX "ContactRequest_propertyId_idx" ON "ContactRequest"("propertyId");

-- AddForeignKey
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyVideo" ADD CONSTRAINT "PropertyVideo_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactRequest" ADD CONSTRAINT "ContactRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

