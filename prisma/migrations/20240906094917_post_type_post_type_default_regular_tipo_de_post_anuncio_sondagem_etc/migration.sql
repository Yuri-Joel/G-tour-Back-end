-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('REGULAR', 'ANUNCIO', 'SONDAGEM');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "commentsBlocked" BOOLEAN DEFAULT false,
ADD COLUMN     "postType" "PostType" NOT NULL DEFAULT 'REGULAR';
