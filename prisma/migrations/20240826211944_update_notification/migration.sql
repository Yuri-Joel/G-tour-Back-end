/*
  Warnings:

  - You are about to drop the column `adminId` on the `notifications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_adminId_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "adminId",
ADD COLUMN     "adminType" BOOLEAN DEFAULT false;
