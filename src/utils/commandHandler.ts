import { App } from '@slack/bolt'
import { validate } from 'node-cron'
import { scheduleCronJob, ScheduledJob } from './cron'
import Log from './logger'
import { Prisma } from './prismaClient'

export const initCommandHandler = (ScheduledJobs: ScheduledJob[], SlackAppInstance: App) => {
  SlackAppInstance.command('/setup', async ({ command, ack, respond }) => {
    await ack()
    const { channel_id: channelId, text: schedule } = command
    if (validate(schedule)) {
      await Prisma.cron.upsert({
        where: { channelId },
        create: { channelId, schedule },
        update: { schedule },
      })

      // stop existing cron job
      ScheduledJobs.filter((job) => channelId === job.channelId).forEach((job) => {
        job.cron.stop()
      })
      // schedule new cron job
      scheduleCronJob({ channelId, schedule }, SlackAppInstance)

      Log.info(`Upserted cron job for ${channelId} with schedule ${schedule}`)
      await respond({
        text: 'Cron job scheduled.', // TODO add funny response
      })
      return
    }
    await respond('Cron syntax error. Validate syntax at this [site](https://crontab.guru/)')
  })

  SlackAppInstance.command('/list', async ({ command, ack, respond }) => {
    await ack()
    const cronJobs = await Prisma.cron.findMany({
      where: { channelId: { equals: command.channel_id } },
    })
    const cronJobText =
      cronJobs.map(({ schedule }, index) => `${index + 1}. \`${schedule}\``).join('\n') ||
      'No cron jobs found.'
    await respond(cronJobText)
  })

  SlackAppInstance.command('/clear', async ({ command, ack, respond }) => {
    await ack()
    const { channel_id: channelId } = command
    await Prisma.cron.deleteMany({
      where: { channelId: { equals: channelId } },
    })
    // stop existing cron job
    ScheduledJobs.filter((job) => channelId === job.channelId).forEach((job) => {
      job.cron.stop()
    })
    await respond('Cron jobs removed.')
  })
}
