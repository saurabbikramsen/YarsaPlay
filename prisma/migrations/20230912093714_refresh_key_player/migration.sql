/*
  Warnings:

  - You are about to drop the `refreshKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "refresh_key" TEXT NOT NULL DEFAULT 'dsfa';

-- DropTable
DROP TABLE "refreshKey";
