-- DropForeignKey
ALTER TABLE "profile_permissions" DROP CONSTRAINT "profile_permissions_id_perfil_fkey";

-- DropForeignKey
ALTER TABLE "profile_permissions" DROP CONSTRAINT "profile_permissions_id_permissoes_fkey";

-- AlterTable
ALTER TABLE "Province" ADD COLUMN     "capital" TEXT;

-- AddForeignKey
ALTER TABLE "profile_permissions" ADD CONSTRAINT "profile_permissions_id_permissoes_fkey" FOREIGN KEY ("id_permissoes") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_permissions" ADD CONSTRAINT "profile_permissions_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "profile_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
