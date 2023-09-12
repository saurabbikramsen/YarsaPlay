/*
  Warnings:

  - You are about to drop the column `stats_id` on the `Player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playerId]` on the table `Statistics` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_stats_id_fkey";

-- DropIndex
DROP INDEX "Player_stats_id_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "stats_id";

-- AlterTable
ALTER TABLE "Statistics" ADD COLUMN     "playerId" TEXT NOT NULL DEFAULT 'sdfas';

-- CreateIndex
CREATE UNIQUE INDEX "Statistics_playerId_key" ON "Statistics"("playerId");

-- AddForeignKey
ALTER TABLE "Statistics" ADD CONSTRAINT "Statistics_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
