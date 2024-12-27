-- CreateTable
CREATE TABLE "PostShare" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "sharedBy" INTEGER NOT NULL,
    "shareText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostShare_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostShare" ADD CONSTRAINT "PostShare_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostShare" ADD CONSTRAINT "PostShare_sharedBy_fkey" FOREIGN KEY ("sharedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
