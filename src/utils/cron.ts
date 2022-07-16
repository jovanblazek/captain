import { App } from '@slack/bolt'
import cron from 'node-cron'
import ScheduledJobs from '../classes/ScheduledJobs'
import Log from './logger'
import { randomPicker } from './randomPicker'

export const scheduleCronJob = (
  {
    channelId,
    schedule,
    message,
    ignoredMembers,
  }: { channelId: string; schedule: string; message: string; ignoredMembers: string[] },
  slackAppInstance: App
) => {
  const newJob = {
    channelId,
    cron: cron.schedule(
      schedule,
      () => {
        Log.info(`Running cron job for channelId ${channelId}`)
        randomPicker({ channelId, message, ignoredMembers, slackAppInstance }).catch((error) => {
          Log.error(error)
        })
      },
      {
        scheduled: true,
        timezone: 'Europe/Berlin',
      }
    ),
  }
  ScheduledJobs.getInstance().addJob(newJob)
}
