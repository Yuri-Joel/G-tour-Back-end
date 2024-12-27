/*
  Warnings:

  - You are about to drop the column `photos_plus` on the `Province` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Province" DROP COLUMN "photos_plus",
ADD COLUMN     "photos" TEXT[],
ADD COLUMN     "videos" TEXT[];
