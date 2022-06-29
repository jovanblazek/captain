import { initCommandHandler } from './utils/commandHandler'
import { scheduleCronJob, ScheduledJob } from './utils/cron'
import Log from './utils/logger'
import { Prisma } from './utils/prismaClient'
import createSlackApp from './utils/slackApp'
import '../config/environment'

const { PORT } = process.env

const ScheduledJobs: ScheduledJob[] = []

export const SlackAppInstance = createSlackApp()

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
