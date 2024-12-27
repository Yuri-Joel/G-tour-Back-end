/*
  Warnings:

  - You are about to drop the column `resposta` on the `resposta_analise_mercado` table. All the data in the column will be lost.
  - Added the required column `id_opcao_analise_mercado` to the `resposta_analise_mercado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resposta_analise_mercado" DROP COLUMN "resposta",
ADD COLUMN     "id_opcao_analise_mercado" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "opcao_analise_mercado" (
    "id" SERIAL NOT NULL,
    "id_analise_mercado" INTEGER NOT NULL,
    "opcao" TEXT NOT NULL,

    CONSTRAINT "opcao_analise_mercado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "opcao_analise_mercado" ADD CONSTRAINT "opcao_analise_mercado_id_analise_mercado_fkey" FOREIGN KEY ("id_analise_mercado") REFERENCES "analise_mercado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resposta_analise_mercado" ADD CONSTRAINT "resposta_analise_mercado_id_opcao_analise_mercado_fkey" FOREIGN KEY ("id_opcao_analise_mercado") REFERENCES "opcao_analise_mercado"("id") ON DELETE CASCADE ON UPDATE CASCADE;
