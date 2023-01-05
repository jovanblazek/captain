import { scheduleCronJob } from 'cron/scheduleCron'
import Log from 'utils/logger'
import Prisma from 'utils/prismaClient'

const loadTextCrons = () =>
  Prisma.textCron.findMany({
    include: {
      cron: true,
    },
  })

// TODO: Implement
const executeTextCron = () => {
  Log.info('Executing text cron')
}

export const initTextCrons = async () => {
  try {
    const textCrons = await loadTextCrons()
    textCrons.forEach(({ cron }) => {
      scheduleCronJob({
        cron,
        executeFunction: executeTextCron,
      })
    })
    return textCrons.length
  } catch (error) {
    Log.error('There was an error while loading text crons', error)
    return 0
  }
}
