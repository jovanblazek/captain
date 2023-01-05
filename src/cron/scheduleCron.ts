import { Cron } from '@prisma/client'
import ScheduledJobs from 'classes/ScheduledJobs'
import nodeCron from 'node-cron'
import Log from 'utils/logger'

const TIME_ZONE = 'Europe/Berlin'

export interface ScheduleCronJobProps {
  cron: Pick<Cron, 'channelId' | 'schedule'>
  executeFunction: (...args: unknown[]) => void | Promise<void>
}

export const scheduleCronJob = ({ cron, executeFunction }: ScheduleCronJobProps) => {
  const { channelId, schedule } = cron
  const newJob = {
    channelId,
    cron: nodeCron.schedule(
      schedule,
      () => {
        Log.info(`Running cron job for channelId ${channelId}`)
        executeFunction()?.catch((error) => {
          Log.error(error)
        })
      },
      {
        scheduled: true,
        timezone: TIME_ZONE,
      }
    ),
  }
  ScheduledJobs.getInstance().removeChannelJobs(channelId) // remove when we allow multiple crons per channel
  ScheduledJobs.getInstance().addJob(newJob)
}
