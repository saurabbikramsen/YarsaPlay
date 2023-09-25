-- CreateTable
CREATE TABLE "Chats" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);
