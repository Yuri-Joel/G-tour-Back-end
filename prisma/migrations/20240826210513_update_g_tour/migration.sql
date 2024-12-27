-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "denunciasCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "adminId" INTEGER,
ADD COLUMN     "postId" INTEGER,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "warningsCount" INTEGER DEFAULT 0;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User_Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
