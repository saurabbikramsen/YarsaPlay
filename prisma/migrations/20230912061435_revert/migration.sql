/*
  Warnings:

  - You are about to drop the column `playerId` on the `Statistics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stats_id]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stats_id` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Statistics" DROP CONSTRAINT "Statistics_playerId_fkey";

-- DropIndex
DROP INDEX "Statistics_playerId_key";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "stats_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Statistics" DROP COLUMN "playerId";

-- CreateIndex
CREATE UNIQUE INDEX "Player_stats_id_key" ON "Player"("stats_id");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_stats_id_fkey" FOREIGN KEY ("stats_id") REFERENCES "Statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
