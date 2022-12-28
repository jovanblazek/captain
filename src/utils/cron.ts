import { App } from '@slack/bolt'
import ScheduledJobs from 'classes/ScheduledJobs'
import cron from 'node-cron'
import Log from './logger'
import { picker, PickerOptions } from './picker'
import Prisma from './prismaClient'

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
  ScheduledJobs.getInstance().removeChannelJobs(channelId)
  ScheduledJobs.getInstance().addJob(newJob)
}

export const initCronJobs = async (slackAppInstance: App) => {
  try {
    const cronJobs = await Prisma.cron.findMany()
    cronJobs.forEach(({ channelId, schedule, message }) => {
      const ignoredMembers: string[] = [] // TODO fetch ignored members from DB
      scheduleCronJob(schedule, { channelId, ignoredMembers, message }, slackAppInstance)
    })
    Log.info(`Loaded ${cronJobs.length} cron jobs`)
    return cronJobs.length
  } catch (error) {
    throw new Error(error as string)
  }
}
