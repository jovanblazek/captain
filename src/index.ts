// eslint-disable-next-line simple-import-sort/imports
import '../config/environment'
import { App as SlackApp } from '@slack/bolt'
import { scheduleCronJob, ScheduledJob } from './utils/cron'
import { initCommandHandler } from './utils/commandHandler'
import Log from './utils/logger'
import { Prisma } from './utils/prismaClient'

const { PORT, SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN } = process.env

const ScheduledJobs: ScheduledJob[] = []

export const SlackAppInstance = new SlackApp({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: SLACK_APP_TOKEN,
  port: Number(PORT) || 4000,
})

async function main() {
  await SlackAppInstance.start()
  Log.info(`Slack bot server is running. API is listening on port ${PORT || ''}`)
  initCommandHandler(ScheduledJobs, SlackAppInstance)

  const cronJobs = await Prisma.cron.findMany()
  cronJobs.forEach(({ channelId, schedule }) => {
    const cron = scheduleCronJob({ channelId, schedule }, SlackAppInstance)
    ScheduledJobs.push(cron)
  })
  Log.info(`Loaded ${cronJobs.length} cron jobs`)
}

main()
  .catch((error) => {
    Log.error(error)
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await Prisma.$disconnect()
  })
