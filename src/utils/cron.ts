import { App } from '@slack/bolt'
import cron from 'node-cron'
import ScheduledJobs from '../classes/ScheduledJobs'
import Log from './logger'
import { picker, PickerOptions } from './picker'

export const scheduleCronJob = (
  schedule: string,
  pickerOptions: PickerOptions,
  slackAppInstance: App
) => {
  const { channelId } = pickerOptions
  const newJob = {
    channelId,
    cron: cron.schedule(
      schedule,
      () => {
        Log.info(`Running cron job for channelId ${channelId}`)
        picker(pickerOptions, slackAppInstance).catch((error) => {
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
