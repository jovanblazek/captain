-- DropForeignKey
ALTER TABLE "MembersCron" DROP CONSTRAINT "MembersCron_cronId_fkey";

-- DropForeignKey
ALTER TABLE "TextCron" DROP CONSTRAINT "TextCron_cronId_fkey";

-- AddForeignKey
ALTER TABLE "MembersCron" ADD CONSTRAINT "MembersCron_cronId_fkey" FOREIGN KEY ("cronId") REFERENCES "Cron"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextCron" ADD CONSTRAINT "TextCron_cronId_fkey" FOREIGN KEY ("cronId") REFERENCES "Cron"("id") ON DELETE CASCADE ON UPDATE CASCADE;
