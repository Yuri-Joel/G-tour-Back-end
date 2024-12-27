/*
  Warnings:

  - You are about to drop the `PostShare` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostShare" DROP CONSTRAINT "PostShare_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostShare" DROP CONSTRAINT "PostShare_sharedBy_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "shareCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sharedFrom" INTEGER;

-- DropTable
DROP TABLE "PostShare";

-- CreateTable
CREATE TABLE "SharedPost" (
    "id" SERIAL NOT NULL,
    "originalPostId" INTEGER NOT NULL,
    "sharerId" INTEGER NOT NULL,
    "sharedContent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_sharedFrom_fkey" FOREIGN KEY ("sharedFrom") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPost" ADD CONSTRAINT "SharedPost_originalPostId_fkey" FOREIGN KEY ("originalPostId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPost" ADD CONSTRAINT "SharedPost_sharerId_fkey" FOREIGN KEY ("sharerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
