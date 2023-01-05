import { App } from '@slack/bolt'
import Log from 'utils/logger'
import { initMemberCrons, initTextCrons } from './crons'

export const initCronJobs = async (slackAppInstance: App) => {
  const loadedCrons = await Promise.allSettled([initMemberCrons(slackAppInstance), initTextCrons()])
  const loadedCronsCount = loadedCrons.reduce((acc, curr) => {
    if (curr.status === 'fulfilled') {
      return acc + curr.value
    }
    return acc
  }, 0)
  Log.info(`Loaded ${loadedCronsCount} cron jobs`)
}
