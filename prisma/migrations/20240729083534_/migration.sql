-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "viewedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "online" BOOLEAN DEFAULT false;
