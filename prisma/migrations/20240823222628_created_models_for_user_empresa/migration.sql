-- CreateEnum
CREATE TYPE "Familia" AS ENUM ('PRODUTO', 'SERVICO');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "TipoAnuncio" AS ENUM ('NORMAL', 'PROMOCAO');

-- CreateEnum
CREATE TYPE "TipoResposta" AS ENUM ('RADIO', 'CHECK');

-- CreateTable
CREATE TABLE "artigo" (
    "id" SERIAL NOT NULL,
    "id_user_app" INTEGER NOT NULL,
    "nome_artigo" TEXT NOT NULL,
    "imagem" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "familia" "Familia" NOT NULL,
    "estado" "Estado" NOT NULL,

    CONSTRAINT "artigo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anuncio" (
    "id" SERIAL NOT NULL,
    "id_artigo" INTEGER NOT NULL,
    "percentagem_desconto" DOUBLE PRECISION,
    "tipo_anuncio" "TipoAnuncio" NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "anuncio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analise_mercado" (
    "id" SERIAL NOT NULL,
    "id_artigo" INTEGER NOT NULL,
    "questao" TEXT NOT NULL,
    "tipo_resposta" "TipoResposta" NOT NULL,

    CONSTRAINT "analise_mercado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resposta_analise_mercado" (
    "id" SERIAL NOT NULL,
    "id_analise_mercado" INTEGER NOT NULL,
    "resposta" TEXT NOT NULL,

    CONSTRAINT "resposta_analise_mercado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_resposta_analise_mercado" (
    "id" SERIAL NOT NULL,
    "id_resposta_analise_mercado" INTEGER,
    "id_user" INTEGER NOT NULL,
    "outro" TEXT,

    CONSTRAINT "user_resposta_analise_mercado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "artigo" ADD CONSTRAINT "artigo_id_user_app_fkey" FOREIGN KEY ("id_user_app") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncio" ADD CONSTRAINT "anuncio_id_artigo_fkey" FOREIGN KEY ("id_artigo") REFERENCES "artigo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analise_mercado" ADD CONSTRAINT "analise_mercado_id_artigo_fkey" FOREIGN KEY ("id_artigo") REFERENCES "artigo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resposta_analise_mercado" ADD CONSTRAINT "resposta_analise_mercado_id_analise_mercado_fkey" FOREIGN KEY ("id_analise_mercado") REFERENCES "analise_mercado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_resposta_analise_mercado" ADD CONSTRAINT "user_resposta_analise_mercado_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_resposta_analise_mercado" ADD CONSTRAINT "user_resposta_analise_mercado_id_resposta_analise_mercado_fkey" FOREIGN KEY ("id_resposta_analise_mercado") REFERENCES "resposta_analise_mercado"("id") ON DELETE CASCADE ON UPDATE CASCADE;
