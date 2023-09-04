-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Statistics" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0;
