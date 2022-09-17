import { initCommandHandler } from './utils/commandHandler'
import { initCronJobs } from './utils/cron'
import Log from './utils/logger'
import { initModalHandler } from './utils/modals/modalHandler'
import { Prisma } from './utils/prismaClient'
import createSlackApp from './utils/slackApp'
import '../config/environment'

const { PORT } = process.env

const SlackAppInstance = createSlackApp()

async function main() {
  await SlackAppInstance.start()
  initCommandHandler(SlackAppInstance)
  initModalHandler(SlackAppInstance)
  await initCronJobs(SlackAppInstance)
  Log.info(`Slack bot server is running. API is listening on port ${PORT || ''}`)
}

main()
  .catch((error) => {
    Log.error(error)
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await Prisma.$disconnect()
  })
