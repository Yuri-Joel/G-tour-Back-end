/*
  Warnings:

  - Made the column `adminType` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "StatusDenuncia" AS ENUM ('PENDENTE', 'ACEITA', 'BLOQUEIO_PERMISSOES', 'DESATIVACAO', 'AVISO');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'bloqueado';
ALTER TYPE "Status" ADD VALUE 'suspenso';

-- AlterTable
ALTER TABLE "denuncia" ADD COLUMN     "status" "StatusDenuncia" NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "commentId" INTEGER,
ALTER COLUMN "adminType" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "alertaCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
