/*
  Warnings:

  - You are about to drop the column `channelId` on the `Cron` table. All the data in the column will be lost.
  - You are about to drop the column `ignoredMembers` on the `Cron` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Cron` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Cron` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Cron_channelId_key";

-- AlterTable
ALTER TABLE "Cron" DROP COLUMN "channelId",
DROP COLUMN "ignoredMembers",
DROP COLUMN "message",
ALTER COLUMN "schedule" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "MembersCron" (
    "id" SERIAL NOT NULL,
    "cronId" INTEGER NOT NULL,
    "channelId" TEXT NOT NULL,
    "message" TEXT,
    "ignoredMembers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembersCron_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextCron" (
    "id" SERIAL NOT NULL,
    "cronId" INTEGER NOT NULL,
    "channelId" TEXT NOT NULL,
    "message" TEXT,
    "options" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TextCron_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MembersCron_id_key" ON "MembersCron"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MembersCron_cronId_key" ON "MembersCron"("cronId");

-- CreateIndex
CREATE UNIQUE INDEX "TextCron_id_key" ON "TextCron"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TextCron_cronId_key" ON "TextCron"("cronId");

-- CreateIndex
CREATE UNIQUE INDEX "Cron_id_key" ON "Cron"("id");

-- AddForeignKey
ALTER TABLE "MembersCron" ADD CONSTRAINT "MembersCron_cronId_fkey" FOREIGN KEY ("cronId") REFERENCES "Cron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextCron" ADD CONSTRAINT "TextCron_cronId_fkey" FOREIGN KEY ("cronId") REFERENCES "Cron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
