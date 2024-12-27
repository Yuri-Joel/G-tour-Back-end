/*
  Warnings:

  - You are about to drop the `Permissions_App` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "LocalType" ADD VALUE 'ZONA_TURISTA_CONSTITUIDA';

-- DropForeignKey
ALTER TABLE "Permissions_App" DROP CONSTRAINT "Permissions_App_UserId_fkey";

-- DropForeignKey
ALTER TABLE "Permissions_App" DROP CONSTRAINT "Permissions_App_permissionId_fkey";

-- DropTable
DROP TABLE "Permissions_App";

-- DropTable
DROP TABLE "permissions_user";

-- CreateTable
CREATE TABLE "Bloqueio_user_app" (
    "id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Bloqueio_user_app_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions_app" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_singular" BOOLEAN NOT NULL DEFAULT true,
    "is_empresa" BOOLEAN NOT NULL DEFAULT true,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "permissions_app_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_app_name_key" ON "permissions_app"("name");

-- AddForeignKey
ALTER TABLE "Bloqueio_user_app" ADD CONSTRAINT "Bloqueio_user_app_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bloqueio_user_app" ADD CONSTRAINT "Bloqueio_user_app_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions_app"("id") ON DELETE CASCADE ON UPDATE CASCADE;
