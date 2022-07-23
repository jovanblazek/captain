/*
  Warnings:

  - Added the required column `lastPickedMembers` to the `Cron` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cron" ADD COLUMN     "isLastPickExcluded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastPickedMembers" TEXT NOT NULL;
