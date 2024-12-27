-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "isBlocked" BOOLEAN DEFAULT false,
ADD COLUMN     "onlyAdminsCanSend" BOOLEAN DEFAULT false,
ALTER COLUMN "isGroup" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TouristSpot" ADD COLUMN     "companyUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "TouristSpot" ADD CONSTRAINT "TouristSpot_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
