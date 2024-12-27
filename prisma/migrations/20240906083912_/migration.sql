/*
  Warnings:

  - You are about to drop the column `id_opcao_analise_mercado` on the `resposta_analise_mercado` table. All the data in the column will be lost.
  - You are about to drop the `opcao_analise_mercado` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `opcao` to the `resposta_analise_mercado` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "opcao_analise_mercado" DROP CONSTRAINT "opcao_analise_mercado_id_analise_mercado_fkey";

-- DropForeignKey
ALTER TABLE "resposta_analise_mercado" DROP CONSTRAINT "resposta_analise_mercado_id_opcao_analise_mercado_fkey";

-- AlterTable
ALTER TABLE "resposta_analise_mercado" DROP COLUMN "id_opcao_analise_mercado",
ADD COLUMN     "opcao" TEXT NOT NULL;

-- DropTable
DROP TABLE "opcao_analise_mercado";
