import { validate } from 'node-cron'
import { Command } from '../classes'
import { CommandNames } from '../constants'
import { scheduleCronJob } from '../utils/cron'
import Log from '../utils/logger'
import { Prisma } from '../utils/prismaClient'

export default new Command(
  {
    name: CommandNames.setup,
    description: 'Setup a cron job for this channel',
  },
  async ({ ack, command, respond }, scheduledJobs, slackAppInstance) => {
    await ack()
    const { channel_id: channelId, text: schedule } = command
    if (validate(schedule)) {
      await Prisma.cron.upsert({
        where: { channelId },
        create: { channelId, schedule },
        update: { schedule },
      })

      // stop existing cron job
      scheduledJobs
        .filter((job) => channelId === job.channelId)
        .forEach((job) => {
          job.cron.stop()
        })
      // schedule new cron job
      scheduleCronJob({ channelId, schedule }, slackAppInstance)

      Log.info(`Upserted cron job for ${channelId} with schedule ${schedule}`)
      await respond({
        text: 'Cron job scheduled.', // TODO add funny response
      })
      return
    }
    await respond('Cron syntax error. Validate syntax at this [site](https://crontab.guru/)')
  }
)
