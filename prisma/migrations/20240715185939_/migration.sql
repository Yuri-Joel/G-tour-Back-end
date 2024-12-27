-- DropForeignKey
ALTER TABLE "ProvinceHabitat" DROP CONSTRAINT "ProvinceHabitat_provinceId_fkey";

-- AlterTable
ALTER TABLE "Province" ADD COLUMN     "photos_plus" TEXT[];

-- AddForeignKey
ALTER TABLE "ProvinceHabitat" ADD CONSTRAINT "ProvinceHabitat_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE CASCADE ON UPDATE CASCADE;
