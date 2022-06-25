-- CreateTable
CREATE TABLE "Cron" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "channelId" VARCHAR(255) NOT NULL,
    "schedule" VARCHAR(255) NOT NULL,

    CONSTRAINT "Cron_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cron_channelId_key" ON "Cron"("channelId");
