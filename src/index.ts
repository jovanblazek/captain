import { initCronJobs } from 'cron/initCrons'
import { initEventListeners } from 'slack/events'
import { initModalSubmitListeners } from 'slack/modals'
import { initCommandHandler } from 'utils/commandHandler'
import Log from 'utils/logger'
import Prisma from 'utils/prismaClient'
import createSlackApp from 'utils/slackApp'
import '../config/environment'

const { PORT } = process.env

const SlackAppInstance = createSlackApp()

async function main() {
  await SlackAppInstance.start()
  initCommandHandler(SlackAppInstance)
  initModalSubmitListeners(SlackAppInstance)
  initEventListeners(SlackAppInstance)
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
