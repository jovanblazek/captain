/*
  Warnings:

  - You are about to drop the column `channelId` on the `MembersCron` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `MembersCron` table. All the data in the column will be lost.
  - You are about to drop the column `channelId` on the `TextCron` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `TextCron` table. All the data in the column will be lost.
  - Added the required column `channelId` to the `Cron` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cron" ADD COLUMN     "channelId" TEXT NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Unnamed';

-- AlterTable
ALTER TABLE "MembersCron" DROP COLUMN "channelId",
DROP COLUMN "message";

-- AlterTable
ALTER TABLE "TextCron" DROP COLUMN "channelId",
DROP COLUMN "message";
