-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "groupAdminId" INTEGER,
ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "_SecondaryAdmins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SecondaryAdmins_AB_unique" ON "_SecondaryAdmins"("A", "B");

-- CreateIndex
CREATE INDEX "_SecondaryAdmins_B_index" ON "_SecondaryAdmins"("B");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_groupAdminId_fkey" FOREIGN KEY ("groupAdminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SecondaryAdmins" ADD CONSTRAINT "_SecondaryAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SecondaryAdmins" ADD CONSTRAINT "_SecondaryAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
