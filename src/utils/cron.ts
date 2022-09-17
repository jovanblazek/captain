import { App } from '@slack/bolt'
import cron from 'node-cron'
import ScheduledJobs from '../classes/ScheduledJobs'
import Log from './logger'
import { picker, PickerOptions } from './picker'
import { Prisma } from './prismaClient'

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

export const initCronJobs = async (slackAppInstance: App) => {
  const cronJobs = await Prisma.cron.findMany()
  cronJobs.forEach(({ channelId, schedule, ignoredMembers: ignoredMembersJson, message }) => {
    const ignoredMembers: string[] = JSON.parse(ignoredMembersJson) ?? []
    scheduleCronJob(schedule, { channelId, ignoredMembers, message }, slackAppInstance)
  })
  Log.info(`Loaded ${cronJobs.length} cron jobs`)
}
