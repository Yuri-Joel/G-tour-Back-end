-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_sharedFrom_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isOriginalPostDeleted" BOOLEAN DEFAULT false;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_sharedFrom_fkey" FOREIGN KEY ("sharedFrom") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
