-- AlterTable
ALTER TABLE "Chats" ADD COLUMN     "roomsId" TEXT;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "roomsId" TEXT,
ALTER COLUMN "refresh_key" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Rooms" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_name_key" ON "Rooms"("name");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_roomsId_fkey" FOREIGN KEY ("roomsId") REFERENCES "Rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_roomsId_fkey" FOREIGN KEY ("roomsId") REFERENCES "Rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
