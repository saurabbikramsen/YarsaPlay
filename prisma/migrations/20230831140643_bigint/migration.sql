/*
  Warnings:

  - You are about to alter the column `experience_point` on the `Statistics` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Statistics" ALTER COLUMN "experience_point" SET DATA TYPE INTEGER;
