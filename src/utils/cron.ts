import { App } from '@slack/bolt'
import cron from 'node-cron'
import Log from './logger'
import { randomPicker } from './randomPicker'

export type ScheduledJob = {
  channelId: string
  schedule: string
  cron: cron.ScheduledTask
}

export const scheduleCronJob = (
  { channelId, schedule }: { channelId: string; schedule: string },
  slackAppInstance: App
) => ({
  channelId,
  schedule,
  cron: cron.schedule(
    schedule,
    () => {
      Log.info(`Running cron job for channelId ${channelId}`)
      try {
        void randomPicker(channelId, slackAppInstance)
      } catch (error) {
        Log.error(error)
      }
    },
    {
      scheduled: true,
      timezone: 'Europe/Berlin',
    }
  ),
})
