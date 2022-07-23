/*
  Warnings:

  - Added the required column `ignoredMembers` to the `Cron` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cron" ADD COLUMN     "ignoredMembers" TEXT NOT NULL;
