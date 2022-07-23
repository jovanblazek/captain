import { App } from '@slack/bolt'
import cron from 'node-cron'
import ScheduledJobs from '../classes/ScheduledJobs'
import Log from './logger'
import { picker } from './picker'

export const scheduleCronJob = (
  {
    channelId,
    schedule,
    message,
    ignoredMembers,
    isLastPickExcluded,
  }: {
    channelId: string
    schedule: string
    message: string
    ignoredMembers: string[]
    isLastPickExcluded: boolean
  },
  slackAppInstance: App
) => {
  const newJob = {
    channelId,
    cron: cron.schedule(
      schedule,
      () => {
        Log.info(`Running cron job for channelId ${channelId}`)
        picker({ channelId, message, ignoredMembers, isLastPickExcluded }, slackAppInstance).catch(
          (error) => {
            Log.error(error)
          }
        )
      },
      {
        scheduled: true,
        timezone: 'Europe/Berlin',
      }
    ),
  }
  ScheduledJobs.getInstance().addJob(newJob)
}
