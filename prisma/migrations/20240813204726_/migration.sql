-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_provinceId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_sharedFrom_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_sharedFrom_fkey" FOREIGN KEY ("sharedFrom") REFERENCES "Post"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
