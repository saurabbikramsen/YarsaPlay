/*
  Warnings:

  - You are about to drop the column `roomsId` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_roomsId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "roomsId";

-- CreateTable
CREATE TABLE "_PlayerToRooms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerToRooms_AB_unique" ON "_PlayerToRooms"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerToRooms_B_index" ON "_PlayerToRooms"("B");

-- AddForeignKey
ALTER TABLE "_PlayerToRooms" ADD CONSTRAINT "_PlayerToRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToRooms" ADD CONSTRAINT "_PlayerToRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
