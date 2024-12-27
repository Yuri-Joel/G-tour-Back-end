-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "analiseMercadoId" INTEGER,
ADD COLUMN     "anuncioId" INTEGER,
ADD COLUMN     "artigoId" INTEGER;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_analiseMercadoId_fkey" FOREIGN KEY ("analiseMercadoId") REFERENCES "analise_mercado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_artigoId_fkey" FOREIGN KEY ("artigoId") REFERENCES "artigo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "anuncio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
