-- CreateEnum
CREATE TYPE "TipoDenuncia" AS ENUM ('ABUSO_SEXUAL', 'CONTEUDO_PORNOGRAFICO', 'DISCURSO_DE_ODIO', 'FRAUDE', 'VIOLACAO_DE_PRIVACIDADE', 'SPAM', 'OUTRO');

-- DropForeignKey
ALTER TABLE "resposta_analise_mercado" DROP CONSTRAINT "resposta_analise_mercado_id_analise_mercado_fkey";

-- CreateTable
CREATE TABLE "denuncia" (
    "id" SERIAL NOT NULL,
    "denuncianteId" INTEGER NOT NULL,
    "denunciadoUserId" INTEGER,
    "denunciadoLocalId" INTEGER,
    "denunciadoPostId" INTEGER,
    "tipoDenuncia" "TipoDenuncia" NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "denuncia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resposta_analise_mercado" ADD CONSTRAINT "resposta_analise_mercado_id_analise_mercado_fkey" FOREIGN KEY ("id_analise_mercado") REFERENCES "analise_mercado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "denuncia" ADD CONSTRAINT "denuncia_denuncianteId_fkey" FOREIGN KEY ("denuncianteId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "denuncia" ADD CONSTRAINT "denuncia_denunciadoUserId_fkey" FOREIGN KEY ("denunciadoUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "denuncia" ADD CONSTRAINT "denuncia_denunciadoPostId_fkey" FOREIGN KEY ("denunciadoPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "denuncia" ADD CONSTRAINT "denuncia_denunciadoLocalId_fkey" FOREIGN KEY ("denunciadoLocalId") REFERENCES "TouristSpot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
