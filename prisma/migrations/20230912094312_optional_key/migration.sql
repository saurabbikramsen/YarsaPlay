-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "refresh_key" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "refresh_key" DROP NOT NULL;
