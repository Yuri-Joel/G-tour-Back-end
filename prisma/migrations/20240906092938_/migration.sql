/*
  Warnings:

  - You are about to drop the column `artigoId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_analiseMercadoId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_anuncioId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_artigoId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "artigoId";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_analiseMercadoId_fkey" FOREIGN KEY ("analiseMercadoId") REFERENCES "analise_mercado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "anuncio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
