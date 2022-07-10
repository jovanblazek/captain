/*
  Warnings:

  - Added the required column `message` to the `Cron` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cron" ADD COLUMN     "message" TEXT NOT NULL;
